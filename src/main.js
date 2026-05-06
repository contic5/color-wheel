function clear()
{
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,c.width,c.height);
}
function draw()
{
    ctx.lineWidth=0;
    clear();

    //Draw the outermost slice first and then keep going inward until the innermost slice is drawn.
    for(let layer=layers;layer>=1;layer--)
    {
        let lighting=(layer*(lighting_difference))/(layers+1)+min_lighting;

        console.log(lighting);

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
            
            const hue=(360*i)/slices;
            ctx.fillStyle=`hsl(${hue},100%,${lighting}%)`;
            ctx.moveTo(c.width/2, c.height/2);
            ctx.arc(c.width/2,c.height/2,radius,start_angle,end_angle);
            ctx.closePath();
            ctx.fill();
        }
    }
}
export function update_values()
{
    console.log("Updating values");
    slices=parseInt(document.getElementById("slices").value);
    layers=parseInt(document.getElementById("layers").value);
    layer_size=c.width/(2*layers);

    if(this.id=="min_lighting_number")
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
    draw();
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
draw();