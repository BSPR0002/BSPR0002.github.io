Math.root=function root(x,y) {
	const evenPowerRoot=y>0&&y%2==0,negative=x<0&&!evenPowerRoot,solution=(negative?-x:x)**(1/y);
	return solution&&negative&&solution!=Infinity?-solution:solution;
}
Math.rootM=function rootM(x,y) {
	const result=[],evenPowerRoot=y>0&&y%2==0,negative=x<0&&!evenPowerRoot,solution=(negative?-x:x)**(1/y);
	result[0]=solution&&negative&&solution!=Infinity?-solution:solution;
	if (evenPowerRoot&&solution) result[1]=-solution;
	return result;
}
Object.prototype.run=function run(executable){executable(this.valueOf())};