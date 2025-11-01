// Example from our dataService.js
export const getUserCartPath = (appId, userId) => 
    `artifacts/${appId}/users/${userId}/cart/items`;

export const getProductsCollection = (appId) => 
    `artifacts/${appId}/public/data/products`;