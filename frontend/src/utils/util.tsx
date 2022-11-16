export function getTextColorFromFlag(flag:number){
    switch(flag){
        case 1:return 'red'
        case 2:return 'orange'
        default:return 'black'
    }
}

// Only handles hh:mm:ss
export function formatTime(time:string|number){
    if(typeof(time)==='number')
        return time
    let times = time.split(':')
    if(times.length!=3){
        return -1
    }
    return parseInt(times[0])*60*60+parseInt(times[1])*60+parseInt(times[2])
}