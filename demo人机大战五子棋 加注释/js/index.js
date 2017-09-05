
//五子棋
// 问题:决定计算机在棋盘上什么地方落子,遍历整个棋盘还没有被落子的交叉点,用规则去计算交叉点得分,
// 得分最高的点就是计算机需要落子那个点 规则考虑的问题:计算机可以顺利连上五个子以及阻止人连上五个子.

var chess=document.getElementById('chess');

var context=chess.getContext('2d');

var me=true;

var over=false;

// 赢法数组
var wins=[];

// 赢法的统计数组
var myWin=[]; //我方的赢法
//wins[][][0]   wins[][][1]
//myWin[0]=1  myWin[1]=1
//myWin[0]=2
//如果存在一个K使得myWin[k]=5,五个子连成直线,说明第K种赢法被实现
var computerWin=[];//计算机的赢法

for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}

var count=0; //赢法种类的索引
for(var i=0;i<15;i++){      //所有横线的赢法     wins[][][0]  表示是第0种赢法 可能是第一行前面五个子都是true 其他地方是undefined
	for(var j=0;j<11;j++){    //wins[0][0][0]=true
								 //wins[0][1][0]=true 
								 // wins[0][2][0]=true
								 //wins[0][3][0]=true
								 // //wins[0][4][0]=true  第0中赢法  这在棋盘上其实就是一条线
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;//然后count+1       wins[][][1] 表示是第一种赢法   可能是第一行第二个子开始往后五个子是true,其他地方是undifined
															//后面赢法以此类推
										//wins[0][1][1]=true
//i=0,j=10,k=0..4;								 //wins[0][2][1]=true
//意味着第二个索引10到14是true
//win[][][10];
//14是棋盘的边界;						 // wins[0][3][1]=true
//其他循环边界可以把数字代进去看 看true的点是哪五个点								 //wins[0][4][1]=true
								 // //wins[0][5][1]=true  第一种赢法 在棋盘上也是一条线
		}
		count++;
	}
}

for(var i=0;i<15;i++){      //所有竖线 的赢法
	for(var j=0;j<11;j++){    
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
for(var i=0;i<11;i++){      //所有斜线 的赢法
	for(var j=0;j<11;j++){   
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
								
		}
		count++;
	}
}
for(var i=0;i<11;i++){      //所有反斜线 的赢法
	for(var j=14;j>3;j--){   
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
										
								
		}
		count++;
	}
}

console.log(count)  //打印赢法的数量

for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}
// 棋盘
var chessBoard=[];

for(var i=0;i<15;i++){

	chessBoard[i]=[];
	for(var j=0;j<15;j++){
		chessBoard[i][j]=0;
	}
}


window.onload=function(){
	drawChessBoard();
	// oneStep(0,0,true);
	// oneStep(1,1,false);

}


//1.画棋盘      棋盘的画法  canvas绘制直线   
var drawChessBoard=function(){
	context.strokeStyle="#BFBFBF";
	for(var i=0;i<15;i++){ //画棋盘
    context.moveTo(15+i*30,15); //画棋盘横线    调用moveTo  lineTo 方法
    context.lineTo(15+i*30,435);
    context.stroke();
    context.moveTo(15,15+i *30);//画棋盘竖线
    context.lineTo(435,15+i*30);
    context.stroke();
    
// context.moveTo(0,0);
// context.lineTo(450,450);
// context.stroke();

}
}


//2.画棋子    canvas画圆   填充渐变色
var oneStep = function (i,j,me) {
    context.beginPath(); 
    context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI); //arc方法画圆
    context.closePath();						//起始圆                 //终止圆   
    var gradient = context.createRadialGradient(15+i*30+2, 15+j*30-2, 13, 15+i*30+2, 15+j*30-2, 0);//创建渐变对象
    if(me) {
        gradient.addColorStop(0, "#0A0A0A");//起始圆颜色  
        gradient.addColorStop(1, "#636766");//终止圆颜色
    }else{
        gradient.addColorStop(0, "#D1D1D1"); 
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
}
// 3.落子
 chess.onclick=function(e){
 	if(over){
 		return
 	}
 	if(!me){
 		return;
 	}
 	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		chessBoard[i][j]=1;
		// if(me){
		// 	chessBoard[i][j]=1;
		// }else{
		// 	chessBoard[i][j]=2
		// }
		// me=!me;
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k]=6;
				if(myWin[k]==5){
					window.alert("你赢了");
					over=true;
				}
			}
		}
		if(!over){
			me=!me;
			computerAI();
		}
	}
 }

 var computerAI=function(){
 	 var myScore=[];
 	 var  max=0;
 	 var u=0;
 	 var v=0;
 	 var computerScore=[];
 	 for(var i=0;i<15;i++){
 	 	myScore[i]=[];
 	 	computerScore[i]=[];
 	 	for(var j=0;j<15;j++){
 	 		myScore[i][j]=0;
 	 		computerScore[i][j]=0;
 	 	}
 	 }
 	 for(var i=0;i<15;i++){
 	 	for(var j=0;j<15;j++){
 	 		if(chessBoard[i][j]==0){
 	 			for(var k=0;k<count;k++){
 	 				if(wins[i][j][k]){
 	 					if(myWin[k]==1){     //计算得分
 	 						myScore[i][j]+=200;
 	 					}else if(myWin[k]==2){
 	 						myScore[i][j]+=400;
 	 					}else if(myWin[k]==3){
 	 						myScore[i][j]+=2000;
 	 					}else if(myWin[k]==4){
 	 						myScore[i][j]+=10000;
 	 					}
 	 					if(computerWin[k]==1){
 	 						computerScore[i][j]+=220;
 	 					}else if(computerWin[k]==2){
 	 						computerScore[i][j]+=420;
 	 					}else if(computerWin[k]==3){
 	 						computerScore[i][j]+=2100;
 	 					}else if(computerWin[k]==4){
 	 						computerScore[i][j]+=20000;
 	 					}
 	 				}
 	 			}
 	 			if(myScore[i][j]>max){
 	 				max=myScore[i][j];
 	 				u=i;
 	 				v=j;
 	 			}else if(myScore[i][j]==max){
 	 				if(computerScore[i][j]>computerScore[u][v]){
 	 					u=i;
 	 					v=j;
 	 				}
 	 			}
 	 			if(computerScore[i][j]>max){
 	 				max=computerScore[i][j];
 	 				u=i;
 	 				v=j;
 	 			}else if(computerScore[i][j]==max){
 	 				if(myScore[i][j]>myScore[u][v]){
 	 					u=i;
 	 					v=j;
 	 				}
 	 			}
 	 		}
 	 	}
 	 }
 	 oneStep(u,v,false);
 	 chessBoard[u][v]=2;
 	 for(var k=0;k<count;k++){
 	 	if(wins[u][v][k]){
 	 		computerWin[k]++;
 	 		myWin[k]=6;
 	 		if(computerWin[k]==5){
 	 			window.alert('计算机赢了');
 	 			over=true;
 	 		}
 	 	}
 	 }
 	 if(!over){
 	 	me=!me;
 	 	
 	 }

 }
// 用一个三维数组记录五子棋所有的赢法(前面二维代表棋盘,因为我们的棋盘是一个二维数组,后面第三维是赢法的种类)某一种赢法 代表的二维棋盘,上面所有的点只有五个点是true其他都是false
// 五个为true的点一定是连成一条线可以是横线 竖线  斜线由于 规则而决定的

// 然后用一个一维数组记录每种赢法的统计数组  统计每一种赢法 实现的程度 (比如说第三种赢法:有五个为true的点;黑子已经落下了两个子,赢法统计数组A3=2去记录)
// 怎样判断胜负以及落子根据赢法统计数组去决定