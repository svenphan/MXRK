// Initialize your app
App = {
  viz_offset_x: 0.0006,
  viz_offset_y: 0.0006,
  base64data: null,
  init: function() {

    var that = this;
    var myApp = new Framework7({
      animateNavBackIcon: true,
      onPageInit: function() {
          //not the proper way need to wrap in an init myApp
          $('#inputBG').animate({
            opacity:1,
          },4500);
        
        
          $('#inputForm').on('click', function() {
            $("#submit").animate({
                      opacity:1,
                      marginTop:"90px",
                  },700);   
          });
        

        }




    });

    // Export selectors engine
    var $$ = Dom7;

    // Add main View
    var mainView = myApp.addView('.view-main', {
        // Enable dynamic Navbar
        dynamicNavbar: true,
        // Enable Dom Cache so we can use all inline pages
        domCache: true
    });

    myApp.onPageInit('about', function (page) {
    });

    /*DATA VIZ PAGE*/ 
    myApp.onPageInit('dataViz', function (page) {
      console.log('dataViz!');
      that.stopTimer();
      that.getJawboneData();
      setInterval(that.getJawboneData, 600000);

    });

    $(document).on('click', '#btn-download', function() {

      console.log('hitt');
      that.downloadImage();
    });
       
  },
  getJawboneData: function() {

    console.log('getJawBoneData called');
    var that = this;
    var endpoint = 'http://10.96.1.175:3000/jawbone';
    /*
    'http://10.96.1.159:3000/jawbone';
    */
    $.ajax({
        url: endpoint,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization':
        },
        success: function(data) {
            //steps data (more data here)var steps = data.data.items[0].title;
            var steps = data.data.items[0].details.steps;
            var kilometers = data.data.items[0].details.km;
            var constraint = 20;
            console.log(steps);
            console.log(constraint);
            console.log(data);
            $('.steps').html(steps); 
            $('.kilometers').html(kilometers)+'KM'; 
            //controlling the data
            if(steps >= constraint) {
              App.draw(0.00095, 0.00095,360, 100, 100);  
              /*
               App.draw(0.0006, 0.0006, (Math.floor(Math.random() * (360 - 10))+10), 10, 100);             
              */
            } else {
              console.log('this is your else statement');
            }
        },
        error: function(response) {
            console.log('data error', response);
        }
    });
  },
  draw: function(current_offset_x, current_offset_y, color_h, color_b, color_s) {
    /* DATA VIZ DRAWING*/
    var Bean, coffee_draw;
    var that = this;
    //initializing processing init method
    coffee_draw = function(p5) {
      p5.setup = function() {
        p5.size($(window).width(), $(window).height());
        p5.smooth()
        p5.background(255);
        return this.beans = [];
      };
      //drawing and the graphics
      return p5.draw = function() {
        var bean, x, x_off, y, y_off, _i, _len, _ref, _results;
        x_off = p5.frameCount * 0.0008;
        y_off = x_off + 10;
        //processing noise api perline noise
        x = p5.noise(x_off) * p5.width;
        y = p5.noise(y_off) * p5.height;
        if (p5.frameCount % 5 === 0) {
          bean = new Bean(p5, {
            x: x,
            y: y,
            x_off: x_off,
            y_off: y_off
          });
          this.beans.push(bean);
        }
        _ref = this.beans;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bean = _ref[_i];
          _results.push(bean.draw());
        }
        return _results;
      };
    };

    //helper class to help off set
    Bean = (function() {
      function Bean(p5, opts) {
          this.p5 = p5;
          this.x = opts.x;
          this.y = opts.y;
          this.x_off = opts.x_off;
          this.y_off = opts.y_off;
          this.vel = opts.vel || 5;
          this.accel = opts.accel || -0.0003;
        }
        //actually drawing and offestting it.
      Bean.prototype.draw = function() {
        if (!(this.vel > 0)) {
          return;
        }
        this.x_off += current_offset_x;
        this.y_off += current_offset_y;
        // console.log(current_offset_x + "Y");
        // console.log(current_offset_y + "X");
        this.vel += this.accel;
        this.x += this.p5.noise(this.x_off) * this.vel - this.vel / 2;
        this.y += this.p5.noise(this.y_off) * this.vel - this.vel / 2;
        this.set_color();
        return this.p5.point(this.x, this.y);
      };
      //changning color
      Bean.prototype.set_color = function() {
        var a, b, h, s;
        this.p5.colorMode(this.p5.HSB, color_h, color_b, color_s);
        h = this.p5.noise((this.x_off + this.y_off)/2) *360;
        s = 100;
        b = 100;
        a = 4;
        return this.p5.stroke(h, s, b, a);
      };
      return Bean;
    })();
    //create processing instance

    var canvas = document.getElementById('the_canvas');
    new Processing(canvas, coffee_draw);

    setInterval(function() {
      that.setImageToCanvasDrawings();
    }, 3000);

  },
  getRandomID: function(){
    // https://gist.github.com/gordonbrander/2230317
    return '_' + Math.random().toString(36).substr(2, 9);
  },

  stopTimer: function (){
    var h1 = document.getElementsByTagName('time')[0],
    seconds = 0, minutes = 0,
    t;

    function add() {
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      if (minutes >= 60) {
        minutes = 0;
      }
    }

    h1.textContent =(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "0") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
    
    }

    function timer() {
      t = setTimeout(add, 1000);
    
    }
    
    timer();
  },
  setImageToCanvasDrawings:function(){

    
    // // set canvasImg image src to dataURL
    // // so it can be saved as an image
    // //document.getElementById('canvasImg').src = dataURL;

    // var button = document.getElementById('btn-download');
    // // button.addEventListener('click', function (e) {
    // var dataURL = canvas.toDataURL('image/png');

    // this.base64data = canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');

    // button.href = this.base64data;
    // console.log(dataURL);
    // // });

  },
  downloadImage: function() {

    var canvas = document.getElementById('the_canvas');
    //var dataURL = canvas.toDataURL();


    canvas.toBlob(function(blob) {
      saveAs(blob, "canvas.png");
  });


  }
}

 

