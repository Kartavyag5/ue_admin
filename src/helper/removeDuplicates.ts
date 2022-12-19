export function remove_duplicates_from_list(arr, key) {
  
  return arr.filter((item,index,newArr) => newArr.findIndex(item2 => (item2[key] === item[key])) === index)
  
}


function comparePuzzleWord(other, current, k)
{
  return  other[k] == current[k] && JSON.stringify(other.words) === JSON.stringify(current.words)
}


function compareByRound(other, current, k)
{  
  
  return  other[k] == current[k] && other.round == current.round
  
}


function comparePersonType(other, current, k)
{  
  return  other[k] == current[k] && other.user_type == current.user_type
}


function Comparer(otherArray, k, comparer){
  return function(current){
    return otherArray.filter(function(other){
      return comparer(other, current, k)
    }).length == 0;
  }
}

export function find_difference(a, b, key) {
  let cloneA = (JSON.parse(JSON.stringify(a)));
  let cloneB = (JSON.parse(JSON.stringify(b)));

  if(key === 'game_level') {
    var onlyInB = cloneB.filter(Comparer(cloneA, key, comparePuzzleWord ))
  }
  else if(key === 'game_user_id') {
    
    var onlyInB = cloneB.filter(Comparer(cloneA, key, comparePersonType ))
  }
  else {
    var onlyInB =  cloneB.filter(Comparer(cloneA, key, compareByRound ))
  }

  return onlyInB;
}