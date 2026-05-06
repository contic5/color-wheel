function clear()
{
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,c.width,c.height);
}
function getHueFromHex(hex) 
{
  // 1. Convert HEX to RGB
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  // 2. Find min and max values to determine the range
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;
  let h = 0;

  // 3. Calculate Hue based on which channel is max
  if (delta === 0) {
    h = 0; // Achromatic (gray)
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60); // Convert to degrees
  if (h < 0) h += 360;    // Ensure positive value

  return h;
}
function draw()
{
    ctx.lineWidth=0;
    clear();

    //Draw the outermost slice first and then keep going inward until the innermost slice is drawn.
    for(let layer=layers;layer>=1;layer--)
    {
        let lighting=(layer*(lighting_difference))/(layers+1)+min_lighting;
        if(light_to_dark)
        {
            lighting=max_lighting-(layer*(lighting_difference))/(layers+1);
        }

        let radius=layer_size*(layer);

        //Draw each slice of the wheel
        for(let i=0;i<slices;i++)
        {
            let start_angle=angle_radians+(i/slices)*(2*Math.PI);
            let end_angle=angle_radians+((i+1)/slices)*(2*Math.PI);
            end_angle += 0.02; // tiny overlap to avoid anti-aliased gaps
            if(start_angle > 2*Math.PI)
            {
                start_angle-=2*Math.PI;
            }
            if(end_angle > 2*Math.PI)
            {
                end_angle-=2*Math.PI;
            }
            ctx.beginPath();
            
            let hue=(360*i)/slices;
            if(using_one_hue)
            {
                hue=one_hue;
                hue=hue+3*((i%5)-2);
            }

            ctx.fillStyle=`hsl(${hue},100%,${lighting}%)`;
            ctx.moveTo(c.width/2, c.height/2);

            if(slices>1)
            {
                ctx.arc(c.width/2,c.height/2,radius,start_angle,end_angle);
            }
            else
            {
                ctx.arc(c.width/2,c.height/2,radius,0,2*Math.PI);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
}
export function update_values()
{
    console.log("Updating values");

    if(this.id=="slices_number")
    {
        document.getElementById("slices").value=document.getElementById("slices_number").value;
    }
    else if(this.id=="slices")
    {
        document.getElementById("slices_number").value=document.getElementById("slices").value;
    }
    else if(this.id=="layers_number")
    {
        document.getElementById("layers").value=document.getElementById("layers_number").value;
    }
    else if(this.id=="layers")
    {
        document.getElementById("layers_number").value=document.getElementById("layers").value;
    }
    else if(this.id=="min_lighting_number")
    {
        document.getElementById("min_lighting").value=document.getElementById("min_lighting_number").value;
    }
    else if(this.id=="min_lighting")
    {
        document.getElementById("min_lighting_number").value=document.getElementById("min_lighting").value;
    }
    else if(this.id=="max_lighting_number")
    {
        document.getElementById("max_lighting").value=document.getElementById("max_lighting_number").value;
    }
    else if(this.id=="max_lighting")
    {
        document.getElementById("max_lighting_number").value=document.getElementById("max_lighting").value;
    }
    else if(this.id=="angle_degrees_number")
    {
        document.getElementById("angle_degrees").value=document.getElementById("angle_degrees_number").value;
    }
    else if(this.id=="angle_degrees")
    {
        document.getElementById("angle_degrees_number").value=document.getElementById("angle_degrees").value;
    }

    slices=parseInt(document.getElementById("slices").value);
    layers=parseInt(document.getElementById("layers").value);
    layer_size=c.width/(2*layers);

    min_lighting=parseInt(document.getElementById("min_lighting").value);
    max_lighting=parseInt(document.getElementById("max_lighting").value);
    lighting_difference=max_lighting-min_lighting;

    angle_radians=parseInt(document.getElementById("angle_degrees").value)*Math.PI/180;

    console.log(`${min_lighting} ${max_lighting} ${lighting_difference}`);

    if(min_lighting>max_lighting)
    {
        max_lighting=min_lighting;
        document.getElementById("max_lighting").value=max_lighting;
    }

    light_to_dark=document.getElementById("light_to_dark").checked;

    using_one_hue=document.getElementById("using_one_hue").checked;
    one_hue=getHueFromHex(document.getElementById("one_hue").value);
    draw();
}
function run_animation()
{
    slices=animation_dictionary[animation_index][0];
    layers=animation_dictionary[animation_index][1];
    
    document.getElementById("slices").value=slices;
    document.getElementById("slices_number").value=slices;
    document.getElementById("layers").value=layers;
    document.getElementById("layers_number").value=layers;

    layer_size=c.width/(2*layers);

    draw();
    animation_index+=1;
    if(animation_index<animation_dictionary.length)
    {
        setTimeout(run_animation,1000);
    }
}


let c=document.getElementById("my_canvas");  
let ctx=c.getContext("2d");

//How many slices there are in the circle. If there are 10 slices, each slice is 36 degrees and takes up 1/10th of the circle.
let slices=10;

//How many layers there are in the circle. If the circle has a radius of 300 pixels and 3 layers, layer 3 has a radius of 300, layer 2 has a radius of 200 and layer 1 has a radius of 100. 
let layers=5;

let layer_size=c.width/(2*layers);

let min_lighting=20;
let max_lighting=80;

let angle_radians=0;

//Difference between maximum and minimum lighting
let lighting_difference=max_lighting-min_lighting;

let end_radius=c.width/2;
//setInterval(draw,100);

let using_one_hue=false;
let one_hue=0;

let light_to_dark=false;

//Slices and layer count
let animation_dictionary=[
    [1,1],
    [2,1],
    [3,1],
    [5,1],
    [10,1],
    [30,1],
    [90,1],
    [360,1],
    [1,1],
    [1,2],
    [1,3],
    [1,5],
    [1,10],
    [1,30],
    [1,100],
    [1,1],
    [2,2],
    [3,3],
    [5,5],
    [10,10],
    [30,30],
    [120,90],
    [360,100]
];
let animation_index=0;
setTimeout(run_animation,1000);

draw();