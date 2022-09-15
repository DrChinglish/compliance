export default function getSeriousness(suggestion) {
    switch(suggestion.seriousness){
        case 'high':return 0;
        case 'medium':return 1;
        case 'low':return 2;
        default:return -1;
    }
}