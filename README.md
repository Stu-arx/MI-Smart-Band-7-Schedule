# MI-Smart-Band-7-Schedule
小米手环7课程表应用
### 食用教程
1. 在小爱课程表中，先创建课表，导入课表（**建议使用教务导入**）之后，在我的界面选择 **"PC编辑课表"** 。
2. 之后使用电脑打开浏览器打开**开发者工具（F12）**，找到 **网络** ，找到带有 **table参数** 的api，如**https://i.ai.mi.com/course-multi/table?ctId=xxxx&userId=xxx&deviceId=xxxxx&sourceName=course-app-browser** 。
3. 可以看到获取到的数据，将 **data** 的数据复制到 *utils/index.js* 中的 **scheduleData 变量** 中，再进行编译生成安装包就可以啦！

（没写详细编译和安装步骤，详细百度😝）
