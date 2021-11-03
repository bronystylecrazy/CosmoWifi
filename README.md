# CosmoWifi
 Automated login system for cosmohome wifi

## Installation
install all needed dependencies
```
npm install
```

## Run
you can run either NPM or YARN

```
npm run start
```

## Customise Username and Password
- Change **.env.example** to **.env** and then customise the file:
```
LOGIN_USERNAME=<YOUR-LOGIN-USERNAME>
LOGIN_PASSWORD=<YOUR-LOGIN-PASSWORD>
```

## Using with PM2 (Background Process)
-   install **PM2** 

    ```
    npm i -g pm2 pm2-windows-startup
    ```
    and register **pm2-windows-startup** by
    ```
    pm2-windows-startup install
    ```
-   go to your root directory, run process with **PM2** 

    ```
    pm2 start --name=CosmoWiFi node -- loginToWifi.js
    ```
    With this command, it will run your script in backgrand process.

-   Save the current state of PM2 

    ```
    pm2 save
    ```

-   Make it run on windows startup!

    ```
    pm2 starup
    ```
    startup with the lastest saved of your PM2 state.


So, whenever you started windows, it's gonna run **loginToWifi.js** script, which will automatically login and check for your wifi connection every 30 seconds.
