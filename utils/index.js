export function assets(type) {
	return (path) => type + "/" + path;
}

export function NumToStr(num) {
	switch (num) {
		case 0:
			return "零";
		case 1:
			return "一";
		case 2:
			return "二";
		case 3:
			return "三";
		case 4:
			return "四";
		case 5:
			return "五";
		case 6:
			return "六";
		case 7:
			return "日";
		default:
			return "几";
	}
}

export function Utf8ArrayToStr(array) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = array.length;
	i = 0;
	while (i < len) {
		c = array[i++];
		switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				out += String.fromCharCode(c);
				break;
			case 12:
			case 13:
				char2 = array[i++];
				out += String.fromCharCode(((c & 31) << 6) | (char2 & 63));
				break;
			case 14:
				char2 = array[i++];
				char3 = array[i++];
				out += String.fromCharCode(
					((c & 15) << 12) | ((char2 & 63) << 6) | ((char3 & 63) << 0)
				);
				break;
		}
	}
	return out;
}

export function ColorToHex(str) {
	return parseInt(str.replace("#", "0x"), 16);
}

// 课程表
export let scheduleData = {};
