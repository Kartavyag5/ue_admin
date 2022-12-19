export default function getTableRow(pageType) {
    let pageTypeOne = "adminstrative"  
    let pageTypeTwo = "gameSchedule" 
    let pageTypeThree = "other"  
 

    let height = window.innerHeight
    switch (true) {
      case ( height >= 1200):
            if(pageType == pageTypeOne)
                  return 15
            else if(pageType == pageTypeTwo)
                  return 12
            else    
                  return 20
      case (1080 <= height && height < 1200):
            if(pageType == pageTypeOne)
                  return 15
            else if(pageType == pageTypeTwo)
                  return 12
            else    
                  return 17
      case (1050 <= height && height < 1080):
            if(pageType == pageTypeOne)
                  return 13
            else if(pageType == pageTypeTwo)
                  return 10
            else   
                  return 16
      case (900 <= height && height < 1050):
            if(pageType == pageTypeOne)
                  return 12
            else if(pageType == pageTypeTwo)
                  return 9
            else  
                  return 13
      case (768 <= height && height < 900):
            if(pageType == pageTypeOne)
                  return 8
            else if(pageType == pageTypeTwo)
                  return 6
            else    
                  return 9
            
      case (height < 768):
            return 6
      default:
            break;
  }
}
