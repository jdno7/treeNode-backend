class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = new TreeNode('Root')) {
    this.root = root;
  }

  createFactory (name) {
    const factory = new TreeNode(name)
    this.root.children.push(factory)
  }

  removeFactory (name) {
    const f = this.root.children.find(factory => factory.val === name)
    this.root.children = this.root.children.filter(child => child != f)
  }
  
  createFactoryChildren(factoryName, numChildren,lowerBound,upperBound) {
   const f = this.root.children.find(factory => factory.val === factoryName)
   if (f.children.length != 0) f.children = []
    
   function randomIntFromInterval(min, max) { 
   return Math.floor(Math.random() * (max - min + 1) + min)
   }
   for (let i = 0; i < numChildren; i++){
     const childVal =  randomIntFromInterval(lowerBound,upperBound)
      console.log(childVal)
     const childNode = new TreeNode(childVal)
      console.log(childNode)
     f.children.push(childNode)
   }
     
 }
  
}

module.exports = { Tree, TreeNode };
