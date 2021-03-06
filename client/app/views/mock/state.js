export default {
    port:8080,
    status:false,
    projectList:[{
        id:0,
        title:"示例项目demo",
        desc:"这是一个接口模拟示例项目",
        prefix:'demo',
        list:[{
            "title":"这是例子的标题",
            "url":"/",
            "pid":0,
            "content":"hello world.",
            "when":""//条件,
        }]
    }],//mock项目列表
    wsPort:8090,
    wsStatus:false,
    wsList:[{
        id:0,
        title:"推送示例",
        frequency:1,
        rule:'(Math.random()*10).toFixed(2)',
        content:'TEST.TITLE:{"price":@random}'
    }]
}