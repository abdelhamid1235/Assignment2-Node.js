let findKthPositive = function(arr, k) {
    let  missingArr = [];
    let currentNumber = 1;
    for (let i = 1; i <= currentNumber; i++) {
        if(!arr.includes(i)){
            missingArr.push(i);
            if(missingArr.length == k){
                break;
            }
        }
        currentNumber++;
    }
    return missingArr.at(k - 1);
};

console.log(findKthPositive([1,2,3,4] , 2));







