export const CONFIG_OFERTAS = {
  "uTBuzqvBtX1VnsODLyu9": 20,
  "v30R36Ps1L4frniWWPdR": 20,
  "vCGRBYtOr61BLRdReGlg": 20,
  "vGagVOOQB6RVCmarZbwK": 20,
  "vs1EHeK9dmag9ZdkCg1x": 20,
  "vtWN4l9mQqQWeQ8rE7iN": 20,
  "xOViP1bSW5ZTjDD6FOh1": 20,
  "y876HKmHBmESDUpAMErK": 20,
  "y9YKGRv67wPmeNvNfhCJ": 20,
  "ykaCvRTKPDGzXUqMlfew": 20,
  "zJeawTE4Tef8qTLM4PBf": 20
};

/**
 * @param {Object} produto
 * @returns {Object} 
 */
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