import * as utils from "../../../utils/index";

const logger = DeviceRuntimeCore.HmLogger.getLogger("helloworld");
Page({
	build() {
		logger.debug("page build invoked");

		// 获取当前时间
		const time = hmSensor.createSensor(hmSensor.id.TIME);
		let startWeek = 1676822400000;
		let week = parseInt((time.utc - startWeek) / (1000 * 60 * 60 * 24 * 7) + 1);
		let nowDate = [time.hour, time.minute];

		// 解析出今日课程
		let schedule = [];
		utils.scheduleData.courses.forEach((item) => {
			if (
				item.day == time.week &&
				// item.day == 3 &&
				item.weeks.split(",").indexOf(week + "") != -1
			) {
				schedule.push(item);
			}
		});

		// 解析课程的时间段
		let sectionTimes = JSON.parse(utils.scheduleData.setting.sectionTimes);

		const TextColor = 0xffffff;
		let Pos = 0;

		// 屏幕大小
		const ScreenWidth = 192;
		const ScreenHight = 490;

		// 底层幕布
		const BackGround = hmUI.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: ScreenWidth,
			h: ScreenHight,
			radius: 20,
			color: 0x000,
		});

		// 时间
		const TopTime = hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: (Pos += 20),
			w: ScreenWidth,
			h: 20,
			radius: 20,
			color: TextColor,
			text_size: 15,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.NONE,
			text: `${time.month}月${time.day}日 星期${utils.NumToStr(time.week)}`,
		});

		// 首节课
		const Radius = 80; // 半径
		const LineWidth = 8; // 外环宽度
		const CenterX = 96; // 圆中心点
		Pos += Radius + LineWidth + 30;
		const CenterY = Pos;

		// 今天第几节课
		let index = 0;
		schedule.forEach((item) => {
			let sections = item.sections.split(",");
			let endTime =
				sectionTimes[Number(sections[sections.length - 1]) - 1].e.split(":");

			if (
				Number(nowDate[0]) > Number(endTime[0]) ||
				(Number(nowDate[0]) == Number(endTime[0]) &&
					Number(nowDate[1]) >= Number(endTime[1]))
			) {
				index++;
			}
		});

		// 无课提示
		if (
			schedule.length == 0 ||
			(schedule.length != 0 && index >= schedule.length)
		) {
			hmUI.createWidget(hmUI.widget.TEXT, {
				x: 0,
				y: 200,
				w: ScreenWidth,
				h: 20,
				radius: 30,
				color: TextColor,
				text_size: 20,
				align_h: hmUI.align.CENTER_H,
				align_v: hmUI.align.CENTER_V,
				text_style: hmUI.text_style.NONE,
				text: "今天没课啦",
			});
		}

		let backgroundColor = utils.ColorToHex(
			JSON.parse(schedule[index].style).background
		);
		let contentColor = utils.ColorToHex(
			JSON.parse(schedule[index].style).color
		);

		// 内圆
		const TopClass = hmUI.createWidget(hmUI.widget.CIRCLE, {
			center_x: CenterX,
			center_y: CenterY,
			radius: Radius,
			color: backgroundColor,
			alpha: 255,
		});

		let sectionsStart = schedule[index].sections.split(",");
		let startTimeStr = sectionTimes[Number(sectionsStart[0]) - 1].s;
		let endTimeStr =
			sectionTimes[Number(sectionsStart[sectionsStart.length - 1]) - 1].e;
		let startTime = startTimeStr.split(":");
		let endTime = endTimeStr.split(":");
		let deltaTime =
			Number(endTime[0]) * 60 +
			Number(endTime[1]) -
			(nowDate[0] * 60 + nowDate[1]);
		let deltaStartTime =
			Number(startTime[0]) * 60 +
			Number(startTime[1]) -
			(nowDate[0] * 60 + nowDate[1]);
		let allTime =
			Number(endTime[0]) * 60 +
			Number(endTime[1]) -
			(Number(startTime[0]) * 60 + Number(startTime[1]));

		// 外圆环
		const arc = hmUI.createWidget(hmUI.widget.ARC, {
			x: CenterX - Radius - LineWidth,
			y: CenterY - Radius - LineWidth,
			w: Radius * 2 + 2 * LineWidth,
			h: Radius * 2 + 2 * LineWidth,
			start_angle: 90,
			end_angle: 90 + 360 * (deltaTime / allTime),
			color: contentColor,
			line_width: LineWidth,
		});

		// 首节课名称
		const Height = 50;
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: CenterX - Math.sqrt(Radius * Radius - Height * Height),
			y: CenterY - Height,
			w: Math.sqrt(Radius * Radius - Height * Height) * 2,
			h: Height,
			color: contentColor,
			text_size: 25,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.NONE,
			text: schedule[index].name,
		});

		// 首节课教室
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 25,
			y: CenterY,
			w: 142,
			h: 20,
			color: contentColor,
			text_size: 15,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.NONE,
			text: schedule[index].position,
		});

		// 首节课老师
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 25,
			y: CenterY + 20,
			w: 142,
			h: 20,
			color: contentColor,
			text_size: 15,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.NONE,
			text:
				nowDate[0] < Number(startTime[0]) ||
				(Number(startTime[0]) == nowDate[0] && nowDate[1] < startTime[1])
					? startTimeStr + "上课"
					: schedule[index].teacher,
		});

		// 当前课状态
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 10,
			y: (Pos += Radius + LineWidth + 10),
			w: ScreenWidth - 20,
			h: 20,
			color: TextColor,
			text_size: 17,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text_style: hmUI.text_style.NONE,
			text:
				deltaStartTime > 0
					? "还有" +
					  (parseInt(deltaStartTime / 60) != 0
							? parseInt(deltaStartTime / 60) + "小时"
							: "") +
					  (deltaStartTime % 60) +
					  "分钟" +
					  "上课"
					: "还有" +
					  (parseInt(deltaTime / 60) != 0
							? parseInt(deltaTime / 60) + "小时"
							: "") +
					  (deltaTime % 60) +
					  "分钟" +
					  "下课",
		});
		Pos -= 30;

		for (i = index + 1; i < schedule.length; i++) {
			// 那一节
			let sections = schedule[i].sections.split(",");

			// 背景
			hmUI.createWidget(hmUI.widget.FILL_RECT, {
				x: 20,
				y: (Pos += 68),
				w: ScreenWidth - 40,
				h: 60,
				radius: 12,
				color: utils.ColorToHex(JSON.parse(schedule[i].style).background),
			});

			// 课程名
			hmUI.createWidget(hmUI.widget.TEXT, {
				x: 30,
				y: Pos + 6,
				w: ScreenWidth - 60,
				h: 30,
				color: utils.ColorToHex(JSON.parse(schedule[i].style).color),
				text_size: 18,
				align_h: hmUI.align.LEFT,
				align_v: hmUI.align.CENTER_V,
				text_style: hmUI.text_style.NONE,
				text: schedule[i].name,
			});

			// 时间 + 地点
			hmUI.createWidget(hmUI.widget.TEXT, {
				x: 30,
				y: Pos + 28,
				w: ScreenWidth - 60,
				h: 26,
				color: utils.ColorToHex(JSON.parse(schedule[i].style).color),
				text_size: 12,
				align_h: hmUI.align.LEFT,
				align_v: hmUI.align.CENTER_V,
				text_style: hmUI.text_style.NONE,
				text:
					sectionTimes[Number(sections[0]) - 1].s +
					"-" +
					sectionTimes[Number(sections[sections.length - 1]) - 1].e +
					" @" +
					schedule[i].position,
			});
		}
	},
	onInit() {
		logger.debug("page onInit invoked");
	},

	onDestroy() {
		logger.debug("page onDestroy invoked");
	},
});
