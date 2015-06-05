## Laravel, Vue.js and Socket.io

> I have put this repo together so that others can get started easily with Laravel and Vue.js and Socket.io

1. Clone the repo
2. Add a **.env** file and add your database credentials (an example below if you're using Homestead)

```
DB_HOST=192.168.10.10
DB_DATABASE=fiveone-vuejs-socketio
DB_USERNAME=homestead
DB_PASSWORD=secret

BROADCAST_DRIVER=redis
```

3. Run composer install/update
4. Run `npm install` (might need to use `sudo npm install`)
5. Migrate your database `php artisan migrate`
6. Run `gulp` to compile the resources/assets into your public/ directories
7. Open up two tabs within the command line and SSH into Homestead
8. Go to your project root and in the first one run `redis server --port 3001`
9. In the second run `node socket.io`
10. I think you should be ready to test in the browser
11. **/guestbook** to sign the guestbook (Vue.js)
12. **/fire** and **/test** to, well, _fire_ and event and _test_ that you can see it. (All the while you can see the output in the command line)

---

### To do

1. Integrate Vue.js and Socket.io so notifications are sent to logged in users when there is a new post.
2. Install supervisord or similer to keep socket alive.