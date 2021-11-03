require('dotenv').config();
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const delay = ms => new Promise((res,rej) => setTimeout(() => res(), ms));

const wifiLogin = async (username, password) => {
    try{
        const now = Date.now();
        console.log('checking the internet connection...');
        const { data } = await axios.get("http://192.168.2.254/portal/user-authen.php");
        const $ = cheerio.load(data);
        console.log($('h1').text(), ` [${Date.now() - now}ms]`);
        if($('h1').text().trim() === 'You are currently online'){
            await delay(30000);
            return;
        }
    }catch(e){
        console.log("something went wrong! ", e.message);
        return;
    }

    const browser = await puppeteer.launch({ headless: true});
    try{
        console.log(username, password)
        const page = await browser.newPage();
        
        await page.goto('http://192.168.2.254/portal/user-authen.php',{
            waitUntil: "networkidle2",
        });
        await page.waitForSelector("#txtLogin");
        console.log('typing username: ' + process.env.WIFI_USERNAME);
        await page.type("#txtLogin", username);
        await page.waitForSelector("#txtPasswd");
        console.log('typing password: ' + process.env.WIFI_PASSWORD);
        await page.type("#txtPasswd", password);
        await page.waitForSelector("#btnLogin");
        await page.waitForTimeout(100);
        await page.click("#btnLogin")
        await page.waitForNetworkIdle({});
        console.log("Successfully!")
        await browser.close();
    }catch(e){
        console.log("something went wrong! ", e.message);
        await browser.close();
        return;
    }
};

wifiLogin(process.env.WIFI_USERNAME, process.env.WIFI_PASSWORD)