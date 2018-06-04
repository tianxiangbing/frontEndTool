/**
 * Created with Visual Studio Code
 * github: https://github.com/tianxiangbing/mock
 * homepage:http://www.lovewebgames.com/mock
 * User: 田想兵
 * Date: 2017-03-02
 * Time: 16:27:55
 * Contact: 55342775@qq.com
 * Desc: 确保代码最新及时修复bug，请去github上下载最新源码 https://github.com/tianxiangbing/mock
 */
let electron = require('electron');
let path = require('path');
const { app, Menu, Tray } = electron;
const { BrowserWindow } = electron;
const fs = require('fs');
// const com = require('./js/common');
const os = require('os');
var package = require("./package.json");
let win = null, loadingScreen;
let now = +new Date();
let tray = null;
function openWindow() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
    let mainStyle = {
        icon: __dirname + '/client/favicon.ico',
        title: 'IceStar V' + package.version,
        show: false,
        backgroundColor: 'rgb(30, 30, 30)',
        minWidth: 1000,
        titleBarStyle: 'hidden',
        width: width-100,
        height: height-100,
        frame: false,
        resizable: true
    }
    win = new BrowserWindow(mainStyle);
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:52013/');
    } else {
        win.loadURL(path.join('file://', __dirname, '/client/index.html'));
    }
    // win.webContents.openDevTools()
    win.on('closed', function () {
        win = null;
        tray.destroy();//销毁托盘图标
    });
    //加快显示速度
    win.webContents.on('did-finish-load', () => {
        console.log(+new Date() - now)
        win.setMenu(null);
        win.show();
        // win.maximize();
        if (loadingScreen) {
            loadingScreen.close();
        }
    });
    win.on('closed', () => {
        win = null;
    });
    // win.webContents.openDevTools();
    let p = path.join(os.homedir(), 'config.json');
    fs.exists(p, (ex) => {
        if (!ex) {
            fs.readFile(path.join(__dirname, '/mock/config.json'), 'utf8', (err, data) => {
                fs.writeFile(p, data, { encoding: 'utf8' });
            })
        }
    });
    let s = path.join(os.homedir(), 'socketconfig.json');
    fs.exists(s, (ex) => {
        if (!ex) {
            fs.readFile(path.join(__dirname, '/mock/socketconfig.json'), 'utf8', (err, data) => {
                fs.writeFile(s, data, { encoding: 'utf8' });
            })
        }
    });
}
let loadingParams = {
    width: 580,
    height: 200,
    frame: false,
    show: false,
    backgroundColor: '#1E1E1E',
    alwaysOnTop: true
};

function createLoadingScreen() {
    loadingScreen = new BrowserWindow(Object.assign(loadingParams, { parent: win }));

    loadingScreen.loadURL(`file://${__dirname}/client/loading.html`);

    loadingScreen.on('closed', () => {
        loadingScreen = null;
    });
    loadingScreen.once('ready-to-show', () => {
        console.log(+new Date() - now, 'loading..')
        loadingScreen.show();
    });
}

app.on('ready', () => {
    createLoadingScreen();
    openWindow();
    let trayIcon = path.join(__dirname, 'client');
    tray = new Tray(path.join(trayIcon, 'favicon.ico'));
    tray.setToolTip('我是前端开发工具.');
    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
    })
    // win.on('show', () => {
    //     tray.setHighlightMode('always')
    // })
    // win.on('hide', () => {
    //     tray.setHighlightMode('never')
    // })
});

app.on('activate', () => {
    if (mainWindow === null) {
        openWindow();
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
const ipc = electron.ipcMain;
const dialog = electron.dialog;

ipc.on('open-dir-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function (files) {
        if (files) event.sender.send('selected-directory', files)
    })
});
ipc.on('open-file-dialog', (event, key, ext) => {
    ext = ext || "*";
    dialog.showOpenDialog({
        filters: [{ name: ext, extensions: [ext] }],
        properties: ['openFile']
    }, function (files) {
        console.log(key, files);
        if (files) event.sender.send(key, files)
    })
});
ipc.on('go-main', function (event) {
    console.log(event)
    console.log(arguments)
    win.focus();
});
