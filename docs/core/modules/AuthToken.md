[@nevermined-io/catalog-core](../README.md) / [Exports](../modules.md) / AuthToken

# Namespace: AuthToken

## Table of contents

### Variables

- [MARKETPLACE\_API\_TOKEN](AuthToken.md#marketplace_api_token)

### Functions

- [fetchMarketplaceApiTokenFromLocalStorage](AuthToken.md#fetchmarketplaceapitokenfromlocalstorage)
- [isTokenValid](AuthToken.md#istokenvalid)
- [newMarketplaceApiToken](AuthToken.md#newmarketplaceapitoken)
- [saveMarketplaceApiTokenToLocalStorage](AuthToken.md#savemarketplaceapitokentolocalstorage)

## Variables

### MARKETPLACE\_API\_TOKEN

• `Const` **MARKETPLACE\_API\_TOKEN**: ``"marketplaceApiToken"``

#### Defined in

[src/utils/marketplace_token.ts:5](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/marketplace_token.ts#L5)

## Functions

### fetchMarketplaceApiTokenFromLocalStorage

▸ **fetchMarketplaceApiTokenFromLocalStorage**(): [`MarketplaceAPIToken`](../interfaces/MarketplaceAPIToken.md)

Get Marketplace API token to local storage

#### Returns

[`MarketplaceAPIToken`](../interfaces/MarketplaceAPIToken.md)

Auth token object which generated from Marketplace API

#### Defined in

[src/utils/marketplace_token.ts:20](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/marketplace_token.ts#L20)

___

### isTokenValid

▸ **isTokenValid**(): `boolean`

Check if Marketplace API Token is valid

#### Returns

`boolean`

Return `true` if token is valid

#### Defined in

[src/utils/marketplace_token.ts:54](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/marketplace_token.ts#L54)

___

### newMarketplaceApiToken

▸ **newMarketplaceApiToken**(`sdk`): `Promise`<[`MarketplaceAPIToken`](../interfaces/MarketplaceAPIToken.md)\>

Generate new Marketplace API API token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdk` | `Nevermined` | Instance of SDK object |

#### Returns

`Promise`<[`MarketplaceAPIToken`](../interfaces/MarketplaceAPIToken.md)\>

Auth token object which generated from Marketplace API

#### Defined in

[src/utils/marketplace_token.ts:36](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/marketplace_token.ts#L36)

___

### saveMarketplaceApiTokenToLocalStorage

▸ **saveMarketplaceApiTokenToLocalStorage**(`i`): `void`

Save Marketplace API token to local storage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `i` | [`MarketplaceAPIToken`](../interfaces/MarketplaceAPIToken.md) | Auth token object which is generated from Marketplace API |

#### Returns

`void`

#### Defined in

[src/utils/marketplace_token.ts:11](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/marketplace_token.ts#L11)