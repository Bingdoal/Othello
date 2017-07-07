function piece (color) 
{
  if (color === undefined) { color = "#000000"; }
  this.radius = 22;
  this.color = color;
  this.lineWidth = 0;
}

piece.prototype.draw = function (context,x,y) 
{  
  context.save();
  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;
  
  //x, y, radius, start_angle, end_angle, anti-clockwise
  context.beginPath();
  context.arc(x, y, this.radius, 0, (Math.PI * 2), true);
  context.fill();
  context.closePath();
  context.restore();
};