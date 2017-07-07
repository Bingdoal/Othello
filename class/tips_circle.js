function tips_circle (color,grad_color) 
{
	if (color === undefined) { color = "#000000"; }
	this.radius = 11;
	this.color = color;
	this.grad_color = grad_color;
	this.lineWidth = 0;
}

tips_circle.prototype.draw = function (context,x,y) 
{  
	context.save();
	// context.lineWidth = this.lineWidth;
	var gradient = context.createRadialGradient(x,y,this.radius,x,y,0);
	gradient.addColorStop(0,this.grad_color);
	gradient.addColorStop(1,this.color);
	context.fillStyle = gradient;
  //x, y, radius, start_angle, end_angle, anti-clockwise
	context.beginPath();
	context.arc(x, y, this.radius, 0, (Math.PI * 2), true);
	context.fill();
	context.closePath();
	context.restore();
};