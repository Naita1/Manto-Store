export const CONFIG_OFERTAS = {
  "uTBuzqvBtX1VnsODLyu9": 20,
  "v30R36Ps1L4frniWWPdR": 30,
  "vCGRBYtOr61BLRdReGlg": 10,
  "vGagVOOQB6RVCmarZbwK": 15,
  "vs1EHeK9dmag9ZdkCg1x": 20,
  "vtWN4l9mQqQWeQ8rE7iN": 5,
  "xOViP1bSW5ZTjDD6FOh1": 10,
  "y876HKmHBmESDUpAMErK": 25,
  "y9YKGRv67wPmeNvNfhCJ": 30,
  "ykaCvRTKPDGzXUqMlfew": 20,
  "zJeawTE4Tef8qTLM4PBf": 15
};

export const applyPriceLogic = (produto) => {
  const discountPercent = CONFIG_OFERTAS[produto.id];
  
  if (discountPercent) {
    const originalPrice = Number(produto.price);
    const finalPrice = Number((originalPrice * (1 - discountPercent / 100)).toFixed(2));
    
    return {
      ...produto,
      hasDiscount: true,
      discount: discountPercent,
      originalPrice: originalPrice,
      price: finalPrice 
    };
  }
  
  return { ...produto, hasDiscount: false };
};