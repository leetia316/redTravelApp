// 根据天气类型返回相关天气图标

/**
 * 天气类型表
 *
 *  0:晴 1:多云 2:阴 3:阵雨 4:雷阵雨 5:雷阵雨伴有冰雹 6:雨夹雪 7:小雨 8:中雨 9:大雨 10:暴雨 11:大暴雨 12:特大暴雨 13:阵雪 14:小雪 15:中雪
 *	16:大雪 17:暴雪 18:雾 19:冻雨 20:沙尘暴 21:小雨-中雨 22:中雨-大雨 23:大雨-暴雨 24:暴雨-大暴雨 25:大暴雨-特大暴雨 26:小雪-中雪 27:中雪-大雪
 *	28:大雪-暴雪 29:浮尘 30:扬沙 31:强沙尘暴 32:霾
	 *
 */

const wtType = [
	 "\u{6674}", "\u{591a}\u{4e91}", "\u{9634}", "\u{9635}\u{96e8}", "\u{96f7}\u{9635}\u{96e8}",
	 "\u{96f7}\u{9635}\u{96e8}\u{4f34}\u{6709}\u{51b0}\u{96f9}", "\u{96e8}\u{5939}\u{96ea}",
	 "\u{5c0f}\u{96e8}", "\u{4e2d}\u{96e8}", "\u{5927}\u{96e8}", "\u{66b4}\u{96e8}", "\u{5927}\u{66b4}\u{96e8}",
	 "\u{7279}\u{5927}\u{66b4}\u{96e8}", "\u{9635}\u{96ea}", "\u{5c0f}\u{96ea}", "\u{4e2d}\u{96ea}", "\u{5927}\u{96ea}",
	 "\u{66b4}\u{96ea}", "\u{96fe}", "\u{51bb}\u{96e8}", "\u{6c99}\u{5c18}\u{66b4}", "\u{5c0f}\u{96e8}\u{2d}\u{4e2d}\u{96e8}",
	 "\u{4e2d}\u{96e8}\u{2d}\u{5927}\u{96e8}", "\u{5927}\u{96e8}\u{2d}\u{66b4}\u{96e8}", "\u{66b4}\u{96e8}\u{2d}\u{5927}\u{66b4}\u{96e8}",
	 "\u{5927}\u{66b4}\u{96e8}\u{2d}\u{7279}\u{5927}\u{66b4}\u{96e8}", "\u{5c0f}\u{96ea}\u{2d}\u{4e2d}\u{96ea}",
	 "\u{4e2d}\u{96ea}\u{2d}\u{5927}\u{96ea}", "\u{5927}\u{96ea}\u{2d}\u{66b4}\u{96ea}",
	 "\u{6d6e}\u{6c89}", "\u{626c}\u{6c99}", "\u{5f3a}\u{6c99}\u{5c18}\u{66b4}", "\u{973e}"
 ];

const weatherType2Icon = (type) => {
	let classType = '';
	switch(type) {

		case wtType[0]: classType = "qingtian";		break;
		case wtType[1]: classType = "Group";	break;
		case wtType[2]: classType = "yintian";		break;
		case wtType[3]: classType = "zhenyu";		break;
		case wtType[4]: classType = "leizhenyu";		break;
		case wtType[5]: classType = "leizhenyu";		break;
		case wtType[6]: classType = "yujiaxue";		break;
		case wtType[7]: classType = "xiaoyu";		break;
		case wtType[8]: classType = "zhongyu";		break;
		case wtType[9]: classType = "dayu";		break;
		case wtType[10]: classType = "baoyu";		break;
		case wtType[11]: classType = "baoyu";		break;
		case wtType[12]: classType = "tedazhenyu";		break;
		case wtType[13]: classType = "xiaoxue";		break;
		case wtType[14]: classType = "xiaoxue";		break;
		case wtType[15]: classType = "zhongxue";		break;
		case wtType[16]: classType = "daxue";		break;
		case wtType[17]: classType = "baoxue";		break;
		case wtType[18]: classType = "wu";		break;
		case wtType[19]: classType = "yujiaxue";		break;
		case wtType[20]: classType = "Group1";		break;
		case wtType[21]: classType = "xiaoyu";		break;
		case wtType[22]: classType = "dayu";		break;
		case wtType[23]: classType = "baoyu";		break;
		case wtType[24]: classType = "tedazhenyu";		break;
		case wtType[25]: classType = "tedazhenyu";		break;
		case wtType[26]: classType = "zhongxue";		break;
		case wtType[27]: classType = "daxue";		break;
		case wtType[28]: classType = "baoxue";		break;
		case wtType[29]: classType = "baoxue";		break;
		case wtType[30]: classType = "duoyunzhuanqingtian";		break;
		case wtType[31]: classType = "Group1";		break;
		case wtType[32]: classType = "wumai";		break;
		default : classType = "shaoyun";				break;
	}
	return classType;

}


export {weatherType2Icon};
