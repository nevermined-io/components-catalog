[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / services/account

# Module: services/account

## Table of contents

### Functions

- [useAccountCollection](services_account.md#useaccountcollection)
- [useAccountReleases](services_account.md#useaccountreleases)
- [useUserProfile](services_account.md#useuserprofile)
- [userIsNFT1155Holder](services_account.md#userisnft1155holder)
- [userIsNFT721Holder](services_account.md#userisnft721holder)

## Functions

### useAccountCollection

▸ **useAccountCollection**(`id`): `Object`

Get account owned nfts

**`Example`**

```typescript
const MyComponent = () => {
 const { isLoading, accountCollection  } = Catalog.useAccountCollection(userAddr);

 return (
  <>
     {accountCollection.map((a) => {
         return (
             <div>
                 <div>{a}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | user address |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountCollection` | `string`[] | All the nfts owned by the account |
| `isLoading` | `boolean` | If the nfts are still loading |

#### Defined in

[src/services/account.ts:76](https://github.com/nevermined-io/components-catalog/blob/76192a6/lib/src/services/account.ts#L76)

___

### useAccountReleases

▸ **useAccountReleases**(`id`): `Object`

Get account releases(mints)

**`Example`**

```typescript
const MyComponent = () => {
 const { isLoading, accountReleases  } = Catalog.useAccountReleases();

 return (
  <>
     {accountReleases.map((a) => {
         return (
             <div>
                 <div>{a}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | user address |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `accountReleases` | `string`[] |
| `isLoading` | `boolean` |

#### Defined in

[src/services/account.ts:32](https://github.com/nevermined-io/components-catalog/blob/76192a6/lib/src/services/account.ts#L32)

___

### useUserProfile

▸ **useUserProfile**(`walletAddress`): `Object`

Custom hook to handle User Profile: login, profile description, add new accounts, etc...

**`Example`**

Profile dashboard example:
```tsx
import React, { useEffect, useRef } from 'react'
import Catalog from '@nevermined-io/catalog-core'
import { MetaMask } from '@nevermined-io/catalog-providers'
import {
  UiForm,
  UiFormGroup,
  UiFormInput,
  UiFormItem,
  Orientation,
  UiButton,
  UiLayout,
  UiText,
  UiDivider,
  UiPopupHandlers,
  NotificationPopup,
  BEM
} from '@nevermined-io/styles'
import { NextPage } from 'next'
import styles from './user-profile.module.scss'

const b = BEM('user-profile', styles)

interface AdditionalInformation {
  linkedinProfile: string
}

export const UserProfile: NextPage = () => {
  const { walletAddress } = MetaMask.useWallet()
  const {
    errorMessage,
    successMessage,
    inputError,
    isUpdated,
    isAddressAdded,
    setUserProfile,
    userProfile,
    addresses,
    newAddress,
    onSubmitUserProfile,
    onAddAddress
  } = Catalog.useUserProfile(walletAddress)

  const popupRef = useRef<UiPopupHandlers>()

  const closePopup = (event: any) => {
    popupRef.current?.close()
    event.preventDefault()
  }

  useEffect(() => {
    if (errorMessage) {
      popupRef.current?.open()
    }
  }, [errorMessage])

  return (
    <UiLayout type="container">
      <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef} />
      <UiLayout type="container">
        <UiText wrapper="h1" type="h1" variants={['heading']}>
          User Profile account
        </UiText>
        <UiText type="h2" wrapper="h2">
          Update your profile
        </UiText>
      </UiLayout>
      <UiDivider />
      <UiLayout type="container">
        <div className={b('profile-horizontal-line')} />
        <UiForm>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              className={b('profile-form-input')}
              label="Nickname *"
              inputError={inputError}
              value={userProfile.nickname}
              onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
              placeholder="Type your nickname"
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              className={b('profile-form-input')}
              label="Name"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              placeholder="Type your name"
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              className={b('profile-form-input')}
              label="Email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              placeholder="Type your email"
            />
          </UiFormGroup>
          <UiFormGroup orientation={Orientation.Vertical}>
            <UiFormInput
              className={b('profile-form-input')}
              label="Link Profile"
              placeholder="Type your link profile"
              value={(userProfile.additionalInformation as AdditionalInformation)?.linkedinProfile}
              onChange={(e) =>
                setUserProfile({
                  ...userProfile,
                  additionalInformation: {
                    linkedinProfile: e.target.value
                  }
                })
              }
            />
          </UiFormGroup>
          <div className={b('profile-submit-container')}>
            <div className={b('profile-submit-container', ['updated-message'])}>
              {isUpdated ? (
                <UiText type="h3" wrapper="h3" variants={['success']}>
                  {successMessage}
                </UiText>
              ) : null}
            </div>
            <div className={b('profile-submit-container', ['submit'])}>
              <UiButton onClick={onSubmitUserProfile}>Update Profile</UiButton>
            </div>
          </div>
        </UiForm>
      </UiLayout>
      <UiLayout type="container" className={b('profile-addresses')}>
        <UiText type="h2" wrapper="h2">
          Addresses
        </UiText>
        <div className={b('profile-horizontal-line')} />
        <UiForm>
          <div>
            <UiText type="h3">Current Addresses</UiText>
          </div>
          <div>
            <UiText variants={['detail']}>
              Change your wallet account to add more address to your profile
            </UiText>
          </div>

          <div className={b('profile-current-addresses-container')}>
            {addresses.map((a) => (
              <div key={a} className={b('profile-current-address')}>
                {a}
              </div>
            ))}
          </div>

          {newAddress && (
            <UiFormGroup orientation={Orientation.Vertical} className={b('profile-add-address')}>
              <UiFormItem
                label="Add new address"
                value={newAddress}
                onClick={onAddAddress}
                disabled={true}
              />
            </UiFormGroup>
          )}

          <div className={b('profile-submit-container')}>
            <div className={b('profile-submit-container', ['updated-message'])}>
              {isAddressAdded ? (
                <UiText type="h3" wrapper="h3" variants={['success']}>
                  {successMessage}
                </UiText>
              ) : null}
            </div>
          </div>
        </UiForm>
      </UiLayout>
    </UiLayout>
  )
}
```

**`See`**

[https://github.com/nevermined-io/defi-marketplace/blob/main/client/src/%2Bassets/user-profile.tsx](https://github.com/nevermined-io/defi-marketplace/blob/main/client/src/%2Bassets/user-profile.tsx)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `walletAddress` | `string` | Address of the wallet account |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `addresses` | `string`[] | Addresses wallet accounts included in the user profile |
| `errorMessage` | `string` | Error messages that come from sdk |
| `inputError` | `string` | Input error message |
| `isAddressAdded` | `boolean` | If new address is added |
| `isUpdated` | `boolean` | If profile is updated |
| `newAddress` | `string` | New address to add in the user profile |
| `onAddAddress` | () => `Promise`<`void`\> | Add new address |
| `onSubmitUserProfile` | () => `Promise`<`void`\> | Submit user profile |
| `setUserProfile` | `Dispatch`<`SetStateAction`<`Partial`<[`UserProfileParams`](../interfaces/index.UserProfileParams.md)\>\>\> | Set parameters to user profile |
| `successMessage` | `string` | Success messages |
| `userProfile` | `Partial`<[`UserProfileParams`](../interfaces/index.UserProfileParams.md)\> | User profile parameters |

#### Defined in

[src/services/account.ts:287](https://github.com/nevermined-io/components-catalog/blob/76192a6/lib/src/services/account.ts#L287)

___

### userIsNFT1155Holder

▸ **userIsNFT1155Holder**(`did`, `walletAddress`): `Object`

This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
of a NFT (limitted by the NFT cap).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | The unique identifier of the NFT within a NFT ERC-1155 contract |
| `walletAddress` | `string` | The public address of the user |

#### Returns

`Object`

true if the user owns at least one edition of the NFT

| Name | Type |
| :------ | :------ |
| `ownNFT1155` | `boolean` |

#### Defined in

[src/services/account.ts:460](https://github.com/nevermined-io/components-catalog/blob/76192a6/lib/src/services/account.ts#L460)

___

### userIsNFT721Holder

▸ **userIsNFT721Holder**(`did`, `nftTokenAddress`, `walletAddress`, `agreementId`): `Object`

This method validates if a user is a NFT (ERC-721 based) holder for a specific NFT contract address.
For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
of a NFT (limitted by the NFT cap).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | - |
| `nftTokenAddress` | `string` | - |
| `walletAddress` | `string` | The public address of the user |
| `agreementId` | `string` | Agreement id generated after order the NFT asset |

#### Returns

`Object`

true if the user holds the NFT

| Name | Type |
| :------ | :------ |
| `ownNFT721` | `boolean` |

#### Defined in

[src/services/account.ts:500](https://github.com/nevermined-io/components-catalog/blob/76192a6/lib/src/services/account.ts#L500)