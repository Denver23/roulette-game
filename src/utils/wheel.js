import {
  ACCELERATION_MOVE,
  BLACK_COLOR_VALUE,
  GREEN_COLOR_VALUE,
  MAX_SPINE_SPEED,
  RED_COLOR_VALUE
} from '../constants';
import { randomInteger } from './helpers';

export default class wheel {
  constructor(x = 0, y = 0, radius = 0, cells = 1, colors = [GREEN_COLOR_VALUE], texts = ["0"]) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.cells = cells;
    this.angle = 0;
    this.speed = 0;
    this.brakeSpeed = 0;
    this.ctx = null;
    this.acceleratedSpeed = 0.15;
    this.pickSpeed = MAX_SPINE_SPEED;
    this.wheelMoveType = ACCELERATION_MOVE;
    this.startPositionAngle = 0;
    this.sectionDiapason = 360/this.cells;

    if (typeof colors == "object" && colors.length === cells)
      this.colors = colors;
    else {
      this.colors = [];
      for (let i = 0; i < cells; i++) {
        const firstColor = i === 0;
        this.colors.push(firstColor ? GREEN_COLOR_VALUE : i%2 == 0 ? BLACK_COLOR_VALUE : RED_COLOR_VALUE);
      }
    }

    if(typeof texts == "object" && texts.length === cells)
      this.texts = texts;
    else {
      this.texts = [];
      for (let i = 0; i < cells; i++)
        this.texts.push(i);
    }
  }

  rotateWheel (value, callback) {
    console.log(`Expected value: ${value}`);
    this.speed = this.wheelMoveType === ACCELERATION_MOVE ? 0 : MAX_SPINE_SPEED;
    const sectionDiapason = 360/this.cells;
    this.startPositionAngle = (value * sectionDiapason + 90)%360;
    this[this.wheelMoveType](callback);
  };


  fastMove (callback) {
    if (this.speed === 0) return false;
    if (this.brakeSpeed === 0) {
      const activePositionAngle = (this.startPositionAngle + this.angle)%360;
      const randomSectionAngle = ((Math.random() < 0.5) ? -1 : 1) * randomInteger(1, 3);
      const needRotateAngle = 360 - activePositionAngle - 24 + randomSectionAngle;
      const s = 6 * 360 + needRotateAngle;
      this.brakeSpeed = -(this.speed * this.speed)/(2 * s);
    }

    this.angle = (this.angle + this.speed)%360;
    this.speed = (this.speed + this.brakeSpeed > 0) ? this.speed + this.brakeSpeed : 0;

    this.draw(this.ctx);

    if (this.speed === 0){
      this.brakeSpeed = 0;
      const result = Math.floor((this.angle < 270 ? (270 - this.angle) : (-this.angle + 630))/this.sectionDiapason);
      console.log(result);
      if (typeof callback === 'function') {
        callback({value: result, color: this.colors[result]})
      };
    }

    if (this.speed > 0) setTimeout(this.fastMove.bind(this, callback),1000/60);
  }

  accelerationMove (callback) {
    this.angle = (this.angle + this.speed)%360;
    this.speed = this.speed + this.acceleratedSpeed;
    this.draw(this.ctx);

    if (this.speed + this.acceleratedSpeed < this.pickSpeed) {
      setTimeout(this.accelerationMove.bind(this, callback),1000/60);
    } else {
      this.speed = MAX_SPINE_SPEED;
      setTimeout(this.fastMove.bind(this, callback),1000/60);
    }
  }

  draw (ctx) {
    this.ctx = ctx;
    const angRast = (Math.PI*2)/this.cells;
    ctx.beginPath();
    ctx.strokeStyle = "#FF0";
    ctx.lineWidth = 10;
    ctx.arc(this.x, this.y, this.radius,0,Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.closePath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(toRadian(this.angle));
    ctx.translate(-this.x, -this.y);
    for(let i = 0; i < this.cells;i++){
      ctx.beginPath();
      ctx.fillStyle = this.colors[i];
      ctx.arc(this.x,this.y,this.radius,i*angRast,(i+1)*angRast);
      ctx.lineTo(this.x,this.y);
      ctx.fill();
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#FF0";
    ctx.lineWidth = 5;
    ctx.arc(this.x,this.y,70,0,Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#FF0";
    ctx.arc(this.x,this.y,60,0,Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#FFF";
    ctx.font = "Normal 25px Impact";
    ctx.fillText("ИДЕТ ИГРА",this.x - 50,this.y + 10);

    ctx.restore();
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#FFF";
    ctx.font = "Normal 15px Impact";
    for(let i = 0; i < this.texts.length; i++){
      ctx.save();
      ctx.translate(this.x, this.y);
      let ang = toRadian(this.angle + angRast/2+15) + (i * angRast);
      ctx.rotate(ang);
      ctx.translate(-this.x, -this.y);
      ctx.fillText(this.texts[i],this.x+150,this.y);
      ctx.strokeText(this.texts[i],this.x+150,this.y);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.fillStyle = "#F00";
    var x = this.x;
    var y = this.y - this.r;
    ctx.moveTo(x,y);
    ctx.lineTo(x-50,y-70);
    ctx.lineTo(x+50,y-70);
    ctx.fill();
    ctx.closePath();
  }
}

const toRadian = (number) => number * Math.PI / 180;
