module.exports = {
    intToBoolean,
    booleanToint,
    projectToBody,
    userTobody,
  };
  
  function intToBoolean(int) {
    return int === 1 ? true : false;
  }
  
  function booleanToint(bool) {
    return bool === true ? 1 : 0;
  }
  
  function projectToBody(project) {
    const result = {
      ...project,
      completed: intToBoolean(project.completed),
    };
  
    return result;
  }
  function userTobody(user) {
   return {
       ...user,
   }
}