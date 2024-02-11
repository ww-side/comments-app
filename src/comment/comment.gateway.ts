import { verify } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { WsJwtInterceptor } from '../interceptors/ws-jwt.interceptor';
import { SaveCommentDto } from './dto/save-comment.dto';

@WebSocketGateway()
@UseInterceptors(WsJwtInterceptor)
export class CommentGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly commentService: CommentService) {}

  handleConnection(client: Socket) {
    const authorizationHeader = client.handshake.headers?.['authorization'];

    const handleAuthorizationError = (errorMessage: string) => {
      client.emit('authorizationError', { error: errorMessage });
      client.disconnect(true);
    };

    if (!authorizationHeader) {
      handleAuthorizationError('Authorization header missing');
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    verify(token, process.env.JWT_SECRET_KEY, (err) => {
      if (err) {
        handleAuthorizationError('Invalid token');
        return;
      }
    });
  }

  @SubscribeMessage('comment')
  async handleComment(
    @MessageBody() comment: SaveCommentDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const token = client.handshake.headers['authorization']?.split(' ')[1];
      const decoded = verify(token, process.env.JWT_SECRET_KEY);
      const userId = decoded['id'];

      const savedComment = await this.commentService.saveComment({
        user_id: userId,
        ...comment,
      });
      this.server.emit('newComment', savedComment);
    } catch (err) {
      this.server.emit('commentError', { error: err.message });
    }
  }

  @SubscribeMessage('getAllComments')
  async handleGetComments() {
    const allComments = await this.commentService.getAllComments();
    this.server.emit('allComments', allComments);
  }
}
