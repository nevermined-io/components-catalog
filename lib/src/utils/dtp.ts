import { Account, NeverminedOptions, DTP, MetaData, MetaDataMain, Nevermined, ServiceType } from '../types'
import { generateIntantiableConfigFromConfig } from '@nevermined-io/nevermined-sdk-js/dist/node/Instantiable.abstract'
import { CryptoConfig } from '@nevermined-io/nevermined-sdk-dtp/dist'
import { aes_decryption_256 } from '@nevermined-io/nevermined-sdk-dtp/dist/utils'
import fileDownload from 'js-file-download'

export const _getDTPInstance = async (sdk: Nevermined, config: NeverminedOptions, cryptoConfig: CryptoConfig) => {
  const instanceConfig = {
    ...generateIntantiableConfigFromConfig(config),
    nevermined: sdk,
  }

  return DTP.Dtp.getInstance(instanceConfig, cryptoConfig)
}

export const _getCryptoConfig = async (sdk: Nevermined) => {
  const nodeInfo = await sdk.services.node.getNeverminedNodeInfo()

  return {
    provider_key: '',
    provider_password: '',
    provider_rsa_public: nodeInfo['rsa-public-key'],
    provider_rsa_private: ''
  }
}

export const _encryptFileMetadata = async (sdk: Nevermined, dtp: DTP.Dtp, metadata: MetaData, password: string) => {
  let dataFiles

  const encryptedPsw = Buffer.from(password).toString('hex')

  const files: MetaDataMain['files'] = [{
    index: 0,
    url: encryptedPsw,
    encryption: 'dtp',
    contentType: 'text/plain'
  }]

  if(metadata.main.files) {
    dataFiles = [...metadata.main.files]
    files.push(...dataFiles.map((d, i) => ({
      index: i +1,
      url: d.url,
      contentType: d.contentType,
    })))
  }

  metadata.main = { ...metadata.main, isDTP: true, files }

  const nodeInfo = await sdk.services.node.getNeverminedNodeInfo()
  const providerKey = nodeInfo['babyjub-public-key']

  metadata.additionalInformation = { 
    ...metadata.additionalInformation,
    poseidonHash: await dtp.keytransfer.hashKey(Buffer.from(encryptedPsw, 'hex')),
    providerKey,
    links: dataFiles?.map(d => ({ name: 'public url', url: d.url }))
  }

  return metadata
}

export const _getGrantAccess = async ({
  did,
  account,
  password,
  sdk,
  dtp,
}:{
  did: string,
  account: Account,
  password: string,
  sdk: Nevermined,
  dtp: DTP.Dtp
}) => {
  const ddo = await sdk.assets.resolve(did)
  const metadata = ddo.findServiceByType('metadata')

  const isDTP = metadata.attributes.main.files?.some( _f => _f.encryption === 'dtp')

  if(!isDTP) return

  const babyAccount = await dtp.babyjubAccount(password)
  account.babySecret = babyAccount.babySecret
  account.babyX = babyAccount.babyX
  account.babyY = babyAccount.babyY

  return account
}

export const _downloadDescryptedFile = async (did: string, dtp: DTP.Dtp, account: Account, agreementId: string, files: File[], serviceType: ServiceType) => {
  const key = await dtp.consumeProof(agreementId, did, account, serviceType)
  const encryptedPassword = Buffer.from(key as string, 'hex').toString()

  files.forEach(async (file) => {
    const buff = await file.arrayBuffer()

    const descrypted = aes_decryption_256(buff, encryptedPassword)
    fileDownload(descrypted, file.name)
  })
}