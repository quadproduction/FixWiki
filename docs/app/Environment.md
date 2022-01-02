# Environment
- For developpement of this wiki, you can add ***fixstudio.wiki*** host in your environment.

## 1. Load PHP Vendor
- First time your download the package, execute the bellow command for loading back front vendors :
```sh
composer install
```
## 2. Load JS Vendor
- Then execute the bellow command for loading front end vendors :
```sh
npm install
```

## 3. Add a virtual host
- It is better to setup an host link to the projet for help you in developpement
- You can follow this doc : [Add new virtual hosts](https://github.com/kekefreedog/LuckyPHP/blob/main/docs/etc/virtual_host.md)
- Don't forget to restart Apache Server

## 4. Check permission
- By default mac restricted permission
- Execute bellow commands for enable permission for read and write on all folders / sub-folders of your app :
```sh
chmod -R +rw /Users/kevin/Sites/fixstudio_wiki/
```
