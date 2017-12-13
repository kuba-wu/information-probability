var ChartModel = {
	
	colors : ["red", "green", "blue", "DarkViolet", "cyan"],
		
	firstIndex : 0,
	firstData : [],
	firstGraphs : [],
	
	secondIndex : 0,
	secondData : [],
	secondGraphs : [],
	
    displayErrorAlert : function(text) {

        $('#mainErrorAlertText').text(text);
        $('#mainErrorAlert').show();
        $("html,body").animate({ scrollTop: 0 }, "slow");
    },
    
    clearErrorAlert : function() {
        $('#mainErrorAlertText').text('');
        $('#mainErrorAlert').hide();
    },
	
	createGraph : function(index, name, color) {
			var graph = {};
			
			graph.type = "line";
			graph.valueField = index;
			graph.title = name;
			
			graph.bullet = "round";
			graph.bulletBorderAlpha =  1;
			graph.bulletSize = 4;
			graph.bulletColor = "#FFFFFF";
			graph.bulletBorderThickness = 1;
			graph.useLineColorForBulletBorder = true;
			
			graph.lineColor = color;
			graph.lineThickness = 2;
			
			return graph;
	},
	
	calculateTargetProbabilityOfElementaryProbability : function(nth, numberOfRepetitions) {
		var maxElementaryProbability = 0.05;
		var numberOfSteps = 100;
		var step = maxElementaryProbability/numberOfSteps;
		var data = [];
		for (var i=0; i < numberOfSteps; i++) {
			var elementaryProbability = step*i;
			var probability = 1 - Math.pow(1-elementaryProbability, numberOfRepetitions);
			var piece = {"x" : +elementaryProbability.toFixed(4)};
			piece[nth+""] = probability;
			data.push(piece)
		}
		return data;
	},
	
	caculateTargetProbabilityOfNumberOfRepetitions : function(nth, elementaryProbability) {
		var maxNumberOfRepetitions = 1000;
		var numberOfSteps = 100;
		var step = maxNumberOfRepetitions/numberOfSteps;
		var data = [];
		for (var i=0; i < numberOfSteps; i++) {
			var numberOfRepetitions = step*i;
			var probability = 1 - Math.pow(1-elementaryProbability, numberOfRepetitions);
			var piece = {"x" : numberOfRepetitions};
			piece[nth+""] = probability;
			data.push(piece)
		}
		return data;
	},

	chartData : function(mergedData, innerId, xTitle, graphs) {

		AmCharts.makeChart(innerId, {
			type : "serial",
			theme : "none",
			marginLeft : 20,
			pathToImages : "webjars/amcharts/3.4.7/images/",
			autoMarginOffset : 5,
			marginTop : 0,
			marginRight : 10,
			zoomOutButton : {
				backgroundColor : '#000000',
				backgroundAlpha : 0.15
			},
			dataProvider : mergedData,
			categoryField : "x",
			// AXES	
			categoryAxis : {
				dashLength : 1,
				gridAlpha : 0.15,
				axisColor : "#DADADA",
				title : xTitle
			},
			// value                
			valueAxes : [{
				axisColor : "#DADADA",
				dashLength : 0,
				labelsEnabled : true,
				title : "Target probability"
			}],
			// graphs
			graphs : graphs,
			
			// legend
			legend : new AmCharts.AmLegend(),
			
			// CURSOR
			chartCursor : {
				cursorPosition : "mouse"
			},
			// SCROLLBAR
			chartScrollbar : {}
		});
	},
	
	mergeIntoData : function(data, array, index) {
		
		if (data.length == 0) {
			for (var i=0; i < array.length; i++) {
				data.push(array[i]);
			}
		} else{
			for (var i=0; i < array.length; i++) {
				data[i][index+""] = array[i][index+""];
			}
		}
	},
	
	addTargetProbabilityOfElementaryProbability : function() {
		var repeats = $('#numberOfRepetitionsInput').val();
		
		if (repeats <= 0) {
			repeats = 200;
			$('#numberOfRepetitionsInput').val(repeats);
			ChartModel.displayErrorAlert("Illegal (negative) nuber of repetitions. Set to default (200).");
		}
		
		if (ChartModel.firstGraphs.length == 5) {
			// reached max - remove first
			ChartModel.firstGraphs.shift();
		} 
		
		var first = ChartModel.calculateTargetProbabilityOfElementaryProbability(ChartModel.firstIndex, repeats);
		ChartModel.mergeIntoData(ChartModel.firstData, first, ChartModel.firstIndex);
		var firstGraph = ChartModel.createGraph(ChartModel.firstIndex, "k="+repeats, ChartModel.colors[ChartModel.firstIndex]);
		ChartModel.firstGraphs.push(firstGraph);
		
		ChartModel.chartData(ChartModel.firstData, "inner", "Elementary probability", ChartModel.firstGraphs.slice());
		
		ChartModel.firstIndex = (ChartModel.firstIndex == 4 ? 0 : ChartModel.firstIndex+1);
	}, 
	
	addTargetProbabilityOfNumberOfRepetitions : function() {
		var elementaryProbability = $('#elementaryProbabilityInput').val();
		
		if (elementaryProbability <= 0) {
			elementaryProbability = 0.1;
			$('#elementaryProbabilityInput').val(elementaryProbability);
			ChartModel.displayErrorAlert("Illegal (negative) elementary probability. Set to default (0.1).");
		}
		
		if (elementaryProbability >= 1) {
			elementaryProbability = 0.1;
			$('#elementaryProbabilityInput').val(elementaryProbability);
			ChartModel.displayErrorAlert("Illegal elementary probability - greater or equal 1. Set to default (0.1).");
		}
		
		if (ChartModel.secondGraphs.length == 5) {
			// reached max - remove first in line
			ChartModel.secondGraphs.shift();
		} 
		
		var second = ChartModel.caculateTargetProbabilityOfNumberOfRepetitions(ChartModel.secondIndex, elementaryProbability);
		ChartModel.mergeIntoData(ChartModel.secondData, second, ChartModel.secondIndex);
		var secondGraph = ChartModel.createGraph(ChartModel.secondIndex, "p="+elementaryProbability, ChartModel.colors[ChartModel.secondIndex]);
		ChartModel.secondGraphs.push(secondGraph);
		
		ChartModel.chartData(ChartModel.secondData, "inner2", "Number of repeats", ChartModel.secondGraphs.slice());
		
		ChartModel.secondIndex = (ChartModel.secondIndex == 4 ? 0 : ChartModel.secondIndex+1);
	}
};

$(document).ready(function(){
	
	ChartModel.clearErrorAlert();
	ChartModel.addTargetProbabilityOfElementaryProbability();
	ChartModel.addTargetProbabilityOfNumberOfRepetitions();
});