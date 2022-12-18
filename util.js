util.convertToTrees = function(array, idFieldName, parentIdFieldName, childrenFieldName){
    var cloned = array.slice();
  
    for(var i=cloned.length-1; i>-1; i--){
      var parentId = cloned[i][parentIdFieldName];
  
      if(parentId){
        var filtered = array.filter(function(elem){
          return elem[idFieldName].toString() == parentId.toString();
        });
  
        if(filtered.length){
          var parent = filtered[0];
  
          if(parent[childrenFieldName]){
            parent[childrenFieldName].push(cloned[i]);
          }
          else {
            parent[childrenFieldName] = [cloned[i]];
          }
        }
        cloned.splice(i,1);
      }
    }
    return cloned;
  }
  
  module.exports = util;