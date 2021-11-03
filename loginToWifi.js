require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const delay = ms => new Promise((res,rej) => setTimeout(() => res(), ms));


let count = 0;
const wifiLogin = async (browser,username, password) => {
    try{
        const now = Date.now();
        console.log('checking the internet connection...');
        const { data } = await axios.get("http://192.168.2.254/portal/user-authen.php");
        const $ = cheerio.load(data);
        console.log($('h1').text(), ` [${Date.now() - now}ms]`);
        if($('h1').text().trim() === 'You are currently online'){
            return;
        }
    }catch(e){
        console.log("something went wrong! ", e.message);
        return;
    }

    
    try{
        console.log('Logging in for: ',username, password)
        const page = await browser.newPage();
        await page.goto('http://192.168.2.254/portal/user-authen.php',{
            waitUntil: "networkidle2",
        });
        await page.waitForSelector("#txtLogin");
        console.log('typing username: ' + process.env.LOGIN_USERNAME);
        await page.type("#txtLogin", username);
        await page.waitForSelector("#txtPasswd");
        console.log('typing password: ' + process.env.LOGIN_PASSWORD);
        await page.type("#txtPasswd", password);
        await page.waitForSelector("#btnLogin");
        await page.waitForTimeout(100);
        await page.click("#btnLogin")
        await page.waitForNetworkIdle({});
        console.log("Successfully!")
        await page.close();
    }catch(e){
        console.log("something went wrong! ", e.message);
        return;
    }
};
(async () =>{
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox']});
    while(true){
        try{
        await wifiLogin(browser,process.env.LOGIN_USERNAME, process.env.LOGIN_PASSWORD);
        console.log(`Done checking #${++count}, Will be checking again in 30 seconds.`);
        await delay(30000);
        }catch(e){
            await browser.close();
            console.log("Something's gone really wrong! ",e.message);
            return;
        }
    }
})();