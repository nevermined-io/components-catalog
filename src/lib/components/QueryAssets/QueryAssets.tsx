import React, { useEffect, useState, useCallback } from 'react';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

import { useNevermined } from 'lib/contexts/NeverminedProvider';

interface QueryAssetsProps {
  infinite?: boolean // TODO: works with pagination or infinite
  children: (
    assets: DDO[],
    info: QueryStats & {canGoNext: boolean, canGoPrev: boolean},
    goNext: () => void,
    goPrev?: () => void,
  ) => any
}

interface QueryStats {
  page: number
  totalPages: number
  totalResults: number
}

export const NuiQueryAssets = React.memo(function ({children}: QueryAssetsProps) {
  const { sdk } = useNevermined();
  const [ assets, setAssets ] = useState<DDO[]>([]);
  const [ stats, setStats ] = useState<QueryStats>();
  const [ page, setPage ] = useState<number>(1);

  const canGoNext = page < (stats?.totalPages || -Infinity)
  const canGoPrev = page > 1

  useEffect(() => {
    if (!sdk?.assets) {
      return
    }
    sdk.assets
      .query({
        offset: 10,
        page,
        query: {},
        sort: {
          created: -1
        },
      })
      .then(result => {
        setStats({...result, results: undefined} as any)
        setAssets(result.results)
      })
  }, [sdk, page])

  const goNext = useCallback(() => {
    if (canGoNext) {
      setPage(page + 1)
    }
  }, [page])

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setPage(page - 1)
    }
  }, [page])

  if (stats && goNext && goPrev) {
    return children(assets, {...stats, canGoNext, canGoPrev}, goNext, goPrev)
  }
  return null
});
