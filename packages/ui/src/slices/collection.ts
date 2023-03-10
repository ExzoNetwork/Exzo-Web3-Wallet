import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { useSelectedAddressWithChainIdChecksum } from '../util/hooks/useSelectedAddressWithChainIdChecksum'

interface Props {
    data: {}[]
    isFetching: boolean
}

const initialState: Props = {
    data: [],
    isFetching: true
}
export const getCollectionData = createAsyncThunk('collection/getCollectionData', async ({ accountAddress, networkName }: { accountAddress: string, networkName: string }) => {

    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'X-API-KEY': 'Nzh9rtss93oqMII0GIkCi1gMVkSimP7H' }
    };
    let temp = new Array();
    let returnData = await new Promise((resolve, reject) => {

        fetch('https://api.blockspan.com/v1/nfts/owner/' + accountAddress + '?chain=' + networkName + '&page_size=10', options)
            .then(response => response.json())
            .then(async (response) => {
                const tokenArray = Array.isArray(response.results) ? response.results : [];
                try {
                    for (const token of tokenArray) {
                        const response = await fetch('https://api.blockspan.com/v1/nfts/contract/' + token.contract_address + '/token/' + token.id + '?chain=eth-main', options)
                        const res = await response.json();
                        if(res.errors?.length > 0) continue;
                        temp.push(res);
                    }
                    resolve(temp)
                } catch (err: any) {
                    throw Error(err)
                }
            })
            .catch((err: any) => { throw Error(err) });
    })

    return returnData

})

export const collection = createSlice({
    name: 'collection',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getCollectionData.pending, (state, action: PayloadAction<any>) => {
            state.isFetching = true
        })
        builder.addCase(getCollectionData.fulfilled, (state, action: PayloadAction<any>) => {
            const nftArray = action.payload
            state.data = nftArray
            state.isFetching = false
        })
    },
})

export default collection.reducer
