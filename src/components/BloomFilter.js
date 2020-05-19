import React, { useState, useEffect } from 'react';
import BloomFilterSetting from './BloomFilterSettings';


function BloomEntry(props) {
    return (
        <div style={{width: 50, height: 50, backgroundColor: props.val ? '#59915B' : '#C1E3C2', borderColor: props.selected ? 'red' : 'black', borderStyle: 'solid'}}></div>
    );
}

function delay(ms){
    var ctr, rej, p = new Promise(function (resolve, reject) {
        ctr = setTimeout(resolve, ms);
        rej = reject;
    });
    p.cancel = function(){ clearTimeout(ctr); rej(Error("Cancelled"))};
    return p; 
}

export default function BloomFilter(props) {
  
    const [hashFns, setHashFns] = useState([]);
    const [filterSize, setFilterSize] = useState(5);

    const [bloomArray, setBloomArray] = useState(Array.from({length: 5}, () => false));
    const [insElem, setInsElem] = useState('');
    const [srchElem, setSrchElem] = useState('');

    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [findMsg, setFindMsg] = useState('');

    const onParamChange = (xfilterSize, xhashFns) => {
        console.log(hashFns);
        console.log(xhashFns);
        setFilterSize(xfilterSize);
        setHashFns(xhashFns);
    }

    useEffect(() => {
        console.log("Filter Size changed");
        setBloomArray(Array.from({length: filterSize}, () => false));
    }, [filterSize]);

    const getHashes = (item) => {
        return hashFns.map((hashFn) => hashFn(item));
    }

    const findElement = async () => {
        const hashes = getHashes(srchElem);

        // Check the validity of hashes
        let hashOk = true;

        if (hashes.length === 0) {
            hashOk = false;
        }

        hashes.forEach((hash) => {
            try{
                if (!(hash < filterSize && hash >= 0)) {
                    alert(`One of the hash functions returned invalid hash ${hash}`);
                    hashOk = false;
                }
            } catch(e) {
                hashOk = false;
            }
            
        });

        
        if (hashOk) {
            let flag = true;

            for (let hash of hashes) {
                if (!bloomArray[hash]) {
                    flag = false;
                }

                selectedIndices.add(hash);
                setSelectedIndices(new Set([...selectedIndices]));
                await delay(300);

                if (!flag) break;
            }

            if (flag) {
                setFindMsg(`${srchElem} might have been inserted before but NOT SURE!`);
            } else {
                setFindMsg(`${srchElem} is not inserted before for sure!`);
            }

            setTimeout(() => setSelectedIndices(new Set([])), 2000)
            
        } else {
            alert('One or more problems with your hash functions are detected');
        }
    };

    const insertElement = async () => {
        if (insElem) {
            const hashes = getHashes(insElem);

            // Check the validity of hashes
            let hashOk = true;

            if (hashes.length === 0) {
                hashOk = false;
            }

            hashes.forEach((hash) => {
                try{
                    if (!(hash < filterSize && hash >= 0)) {
                        alert(`One of the hash functions returned invalid hash ${hash}`);
                        hashOk = false;
                    }
                } catch(e) {
                    hashOk = false;
                }
                
            });

            
            if (hashOk) {
                const temp = [...bloomArray];
                for (let hash of hashes) {
                    temp[hash] = true;
                    selectedIndices.add(hash);
                    setSelectedIndices(new Set([...selectedIndices]));
                    await delay(300);
                };

                setBloomArray(temp);
                
                setTimeout(() => setSelectedIndices(new Set([])), 2000)
                
            } else {
                alert('One or more problems with your hash functions are detected');
            }
        }
    };
    
    return (
        <div className="grid-container">
            <BloomFilterSetting onChange={onParamChange} />

            <div style={{overflow: 'scroll', maxHeight: '100vh', minWidth: '70px'}}>
                {bloomArray.map((val, i) => <BloomEntry key={i} val={val} selected={selectedIndices.has(i)} />)}
            </div>
            <div>
                <h3>Insert</h3>
                <input type="text" value={insElem} onChange={(e) => setInsElem(e.target.value)} />
                <button onClick={insertElement} disabled={!(hashFns.length > 0) || !insElem}>Add</button>

                <h3>Search</h3>
                <input type="text" value={srchElem} onChange={(e) => setSrchElem(e.target.value)} />
                <button onClick={findElement} disabled={!(hashFns.length > 0) || !srchElem}>Find</button>
                <p>
                    <b>
                        {findMsg}
                    </b>
                </p>
            </div>
        </div>
        
    );
}