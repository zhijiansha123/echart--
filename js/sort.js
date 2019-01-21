$(function() {
	var data = dataJson; //json数据
	var myChart = echarts.init(document.getElementById("main"), "light");
	var maxDataArray = []; //存储每组数据的最大值
	var maxData; //设置最大值
	var cityArray = []; //获取所有的城市
	var colorArray = ['#1b90cb', '#fe5d91', '#fda72e', '#c2d130', '#4ac039', '#28bbcb', '#954ce0', '#ffde00', '#17848e']; //颜色数据

	//获取所有的城市 设置柱子颜色需要用到
	data[0].data.forEach(info => {
		cityArray.push(info.name)
	})
	var initData; //初始value值
	var newData = []; //所有数据
	var countNum = 40; //每年添加多少条数据   40：08年新增40条
	var speed = 80; //播放的速度

	for(var i = 0; i < data.length; i++) {
		var obj = data[i]; //data中的每一个数据
		if(newData.length === 0) {
			newData.push(obj);
		} else {
			//平均值
			var average = [];
			for(var a = 0; a < obj.data.length; a++) {
				//最新第一条数据
				var val = obj.data[a].value;
				//上一条第一条数据
				var val1 = initData.data[a].value;
				//平均值
				var val2 = parseInt(((val - val1) / countNum));
				average.push(val2);
			}

			//条数 countNum 有多少条 每年就要新增多少多条数据
			for(j = 0; j < countNum; j++) {
				var dataNews = [];
				for(var a = 0; a < obj.data.length; a++) { //新增的所有城市的value值计算
					var d = obj.data[a];
					var name = d.name;
					var value = 0;
					if(newData.length > 0)
						value = (Number(newData[newData.length - 1].data[a].value) + Number(average[a])); //初始值+平均值=新增的对象的value 值
					//构建每一个新增对象里面的数据
					var dObj = {
						name: name,
						value: value
					};
					dataNews.push(dObj);
				}
				//构建 time data 对象 放到最终赋值的数组中
				var objNew = {
					time: initData.time,
					data: dataNews
				};
				newData.push(objNew);
			}
			newData.push(obj);
		}
		initData = data[i]; //data中的每一个数据
	}
	data = newData; //处理完之后的数据赋值给data
	//console.log(data)
	
	//根据数据的 time属性排序
	data.forEach(ele => {
		data.sort(compare("time", true));
	})

	//每年的数据排序，并将每组的最大值放到maxDataArray
	data.forEach(ele => {
		ele.data.sort(compare("value"), false);
		maxDataArray.push(ele.data[0].value);
	})

	//算出最大值  设置最大横向范围
	var maxData = Math.max.apply(null, maxDataArray);
	
	// 按值排序  order true 从大到小  false 则反 
	function compare(property, order) {
		return function(a, b) {
			var value1 = a[property];
			var value2 = b[property];
			if(order) {
				return value1 - value2;
			} else {
				return value2 - value1;
			}

		}
	}
	
	// 基本配置
	var option = {
		baseOption: {
			timeline: {
				show: false,
				axisType: "category",
				orient: "vertical",
				autoPlay: true,
				inverse: true,
				loop: false,
				playInterval: speed, //播放的速度
				left: "99%",
				right: 60,
				top: 60,
				bottom: 0,
				label: { //轴的文本标签
					position: "left",
					normal: {
						show: true,
						textStyle: {
							color: "#999"
						}
					},
					emphasis: {
						textStyle: {
							color: "#fff"
						}
					}
				},
				lineStyle: {
					color: "#555"
				},
				checkpointStyle: { //当前项的图形样式。
					color: "#bbb",
					borderColor: "#777",
					borderWidth: 2
				},
				controlStyle: { //控制按钮』的样式
					show: true,
					showNextBtn: false,
					showPrevBtn: false,
					normal: {
						color: "#666",
						borderColor: "#666"
					},
					emphasis: {
						color: "#aaa",
						borderColor: "#aaa"
					}
				},

				data: data.map(function(ele) { //timeline 数据
					return ele.time
				})
			},
			backgroundColor: "#f5f5f5",
			title: [{

				text: data.map(function(ele) {
					return ele.time.slice(0, 7);
				}),
				textAlign: "center",
				left: "73%",
				top: "75%",
				textStyle: {
					fontSize: 20,
					color: "rgba(255, 255, 255, 0.7)"
				}
			}],
			grid: {
				left: 50,
				right: 180,
				top: 50,
				bottom: 50
			},
			xAxis: {

				show: false
			},
			yAxis: {

			},
			series: [{
				id: "bar",
				type: "bar",

				tooltip: {
					show: false
				},
				barWidth: 12,
				label: {
					normal: {
						show: true,
						position: "right",
					}
				},
				data: []
			}, {
				id: "bar2",
				type: "bar",

				tooltip: {
					show: false
				},
				barWidth: 12,
				label: {
					normal: {
						show: true,
						position: "right",
					}
				},
				data: []
			}],
			animationDurationUpdate: 1000,
			animationEasingUpdate: "linear"
		},

		options: []
	}

	for(var i = 0; i < data.length; i++) {
		option.options.push({
			title: {
				left: 'right', //距离左侧的距离
				bottom: '50px', //距离底部的距离
				textStyle: {
					color: '#666',
					fontSize: 30
				},
				text: data[i].time.slice(0, 7) //日期名字
			},

			xAxis: {
				type: "value",
				max: maxData,
				boundaryGap: [0, 0.1],
				axisLabel: {
					show: true,
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						opacity: 0.2
					},
				},
				axisLine: {
					lineStyle: {
						color: "#ccc",
						opacity: 0.2
					},
				},

				interval: 200,
			},
			yAxis: [{
				type: "category",
				axisLabel: {
					show: false,
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false,
				},

				data: data[i].data.map(function(ele) { //Y轴数据
					return ele.name
				}).reverse()

			}, {
				type: "category",
				axisLabel: {
					show: false,
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false
				},

				data: data[i].data.map(function(ele) {
					return ele.name
				}).reverse()
			}],
			series: [{
				id: "bar",
				yAxisIndex: 0,

				label: {
					position: "left",
					formatter: "{a|{b}} ", //城市名称
					rich: {
						a: {
							color: "#666",
							fontSize: 14,
							//								fontWeight: "bold",

						}
					}
				},
				z: 1100, //一直在最上层
				data: data[i].data.map(function(ele) {
					return ele.value
				}).reverse(),
				color: function(params) {

					for(var i = 0; i < cityArray.length; i++) {
						if(params.name === cityArray[i]) {
							return colorArray[i]
						}
					}

				}
			}, {
				id: "bar2",
				yAxisIndex: 1,
				label: { //数量大小的样式
					position: "right",
					formatter: "{e|{c}}",
					rich: {
						e: {
							color: '#666',
							fontWeight: "bold",
							align: "right",
							fontSize: 16
						}
					}
				},
				itemStyle: {
					color: 'rgba(255,255,255,0)'
				},
				data: data[i].data.map(function(ele) {
					return ele.value
				}).reverse()
			}]
		})
	}
	myChart.setOption(option);
})