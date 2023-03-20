import React, { useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { generateTestingUtils } from 'eth-testing'
import { appConfig } from '../config'
import { Catalog, AuthToken, SubscriptionsAndServicesDDOs, DDO } from '../../src'
import jwt from 'jsonwebtoken'
import { ddo, ddo2, ddo3, walletAddress, nevermined } from '../mockups'
import { faker } from '@faker-js/faker'

jest.mock('@nevermined-io/sdk', () => ({
  ...jest.requireActual('@nevermined-io/sdk'),
  Nevermined: jest.requireActual('../mockups').nevermined
}))

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
)

describe('Nevermined account', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' })

  afterEach(() => {
    testingUtils.clearAllMocks()
    jest.clearAllMocks()
  })

  it('should be true the auth token', async () => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isTokenValid, setIsTokenValid] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
                exp: faker.date.future().getTime()
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isTokenValid()

              setIsTokenValid(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isTokenValid
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(true)
    }, {
      timeout: 5000
    })
  })

  it('should be false if exp is missing from the auth token', async () => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isTokenValid, setIsTokenValid] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isTokenValid()

              setIsTokenValid(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isTokenValid
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(false)
    }, {
      timeout: 5000
    })
  })

  it('should generate new token', async() => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ token, setToken ] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {

              const result = await account.generateToken()

              setToken(result.token)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return token
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBeTruthy()
    })
  })

  it('should get the signer address which issued the token', async () => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ signer, setSigner] = useState('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = account.getAddressTokenSigner()

              setSigner(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return signer
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(walletAddress)
    }, {
      timeout: 5000
    }) 
  })

  it('should be an asset holder', async () => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isAssetHolder, setIsAssetHolder] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isAssetHolder(ddo.id, walletAddress)

              setIsAssetHolder(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isAssetHolder
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should not be an asset holder', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      keeper: {
        ...sdk.keeper,
        templates: {
          ...sdk.keeper.templates,
          accessTemplate: {
            events: {
              getPastEvents: () => []
            }
          }
        }
      }
    })

    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isAssetHolder, setIsAssetHolder] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isAssetHolder(ddo.id, walletAddress)

              setIsAssetHolder(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isAssetHolder
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('should be a nft721 holder', async () => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isAssetHolder, setIsAssetHolder] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isNFT721Holder(ddo.id, walletAddress)

              setIsAssetHolder(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isAssetHolder
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should not be a nft721 holder', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      contracts: {
        ...sdk.contracts,
        loadNft721: () => ({
          balanceOf: () => ({
            gt: () => false
          })
        })
      }
    })

    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isAssetHolder, setIsAssetHolder] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isNFT721Holder(ddo.id, walletAddress)

              setIsAssetHolder(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isAssetHolder
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('should be a nft1155 holder', async () => {
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isAssetHolder, setIsAssetHolder] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isNFT1155Holder(ddo.id, walletAddress)

              setIsAssetHolder(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isAssetHolder
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should not be a nft1155 holder', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()

    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts: {
        ...sdk.nfts,
        balance: () => 0
      }
      
    })

    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ isAssetHolder, setIsAssetHolder] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const token = jwt.sign({
                iss: walletAddress,
                sub: `u-${faker.datatype.uuid()}`,
                role: [],
              },
              'secret')

              AuthToken.saveMarketplaceApiTokenToLocalStorage({
                token,
              })

              const result = await account.isNFT1155Holder(ddo.id, walletAddress)

              setIsAssetHolder(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isAssetHolder
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it('should get all the subscriptions published by the address passed', async () =>{
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ subscriptions, setSubscriptions ] = useState<DDO[]>([])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await account.getPublishedSubscriptions(walletAddress)

              setSubscriptions([...result])
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return subscriptions
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([ddo])
    })
  })

  it('should get all the subscriptions published and services by the address passed', async () =>{
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ subscriptions, setSubscriptions ] = useState<SubscriptionsAndServicesDDOs[]>([])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await account.getPublishedSubscriptionsAndServices(walletAddress)

              setSubscriptions([...result])
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return subscriptions
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([{
        subscription: ddo,
        services: [ddo2, ddo3]
      }])
    })
  })

  it('should get all the subscriptions purchased by the address passed', async () =>{
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ subscriptions, setSubscriptions ] = useState<DDO[]>([])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await account.getPurchasedSubscriptions(walletAddress)

              setSubscriptions([...result])
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return subscriptions
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([ddo])
    })
  })

  it('should get all the subscriptions purchased and services by the address passed', async () =>{
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ subscriptions, setSubscriptions ] = useState<SubscriptionsAndServicesDDOs[]>([])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await account.getPurchasedSubscriptionsAndServices(walletAddress)

              setSubscriptions([...result])
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return subscriptions
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([{
        subscription: ddo,
        services: [ddo2, ddo3]
      }])
    })
  })

  it('should get all the services associated to the subscription id passed', async () =>{
    const { result } = renderHook(
      () => {
        const { account, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ services, setServices ] = useState<DDO[]>([])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await account.getAssociatedServices(ddo.id)

              setServices([...result])
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return services
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([ddo2, ddo3])
    })
  })
})