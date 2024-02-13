# Comments App
- Nest.js
- socket.io
- Docker

Link - https://comments-app-server-in0a.onrender.com/.

### HTTP requests:
#### POST: /user/registration  
After sending a POST request to the /user/registration address, we have created an
user.
![Pic](https://images2.imgbox.com/dc/5a/UIDZwnuB_o.png)

#### POST: /user/login
After sending a POST request to the /user/login address, the server generates a JWT token.
![Pic](https://images2.imgbox.com/33/f4/BROnE4h7_o.png)

### Socket.io events
We need to create socket.io template for testing requests in Postman.  
> New -> Socket.io

![Pic](https://images2.imgbox.com/55/87/UOUa8up7_o.png)

After that need to add Authorization header.
> Bearer *token*

![Pic](https://images2.imgbox.com/d5/cf/Man7FhcL_o.png)

#### Subscribe to newComment
We need to subscribe to newComment, allComments, commentError that we can see the results.

![Pic](https://images2.imgbox.com/d9/27/MoFIGRXu_o.png)

#### comment event
Finally, we can connect to the ws server and send a 'comment' event with body
> parent_id: *string/null*  
> content: *string*

*parent_id is the id of the comment you are replying to*

![Pic](https://images2.imgbox.com/de/b7/710IIPQA_o.png)

*newComment emit result after comment event*
![Pic](https://images2.imgbox.com/f5/81/4c2FDD51_o.png)

#### getAllComments event
For this event we need to send an empty body and see a result from allComments emit
![Pic](https://images2.imgbox.com/fc/f2/8rJBSR6E_o.png)

*allComments emit result*
![Pic](https://images2.imgbox.com/58/05/IRWWQE4V_o.png)


### Schema tables
users

| id        | username     | password                        | email |
|-----------|--------------|---------------------------------|-------|
| [PK] text | text         | text                            | text  |

comments

| id        | parent_id | user_id | content | created_at                  |
|-----------|-----------|---------|---------|-----------------------------|
| [PK] text | text      | text    | text    | timestamp without time zone |


### Run the project locally
1. git clone https://github.com/ww-side/comments-app
2. Add .env to the root directory. Example environment is in .env.example.
3. docker-compose up --build