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
7. I think you should be good to go