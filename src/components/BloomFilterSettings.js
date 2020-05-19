import React, { useState } from 'react';

function runCode(code) {
    return Function(`return ${code}`)();
}

function tryCode(code) {
    try {
        const fn = runCode(code);
        
        if (!(fn instanceof Function && fn.length > 0)) {
            throw -1;
        }
        return true;
    } catch (e) {
        if (e instanceof SyntaxError) {
            alert(e.message);
        }
        return false;
    }
}

export default function BloomFilterSettings(props) {
    // Expected props
    /**
     * props.onChange
     * 
     */

    const [hashFns, setHashFns] = useState([]);
    const [filterSize, setFilterSize] = useState(5);
    const [txtCode, setTxtCode] = useState(`(item) => item.length % ${filterSize} // Modify`);

    const HashFn = (hashFn, index) => {
        return (
            <div key={index} style={{display: 'grid-column'}}>
                <div style={{borderStyle: 'ridge', paddingLeft: 8, paddingBottom: 4}}>
                    <code className="code">                    
                        <pre>
                        {hashFn}
                        </pre>
                    </code>
                
                    <span>
                        <button onClick={() => {
                            const temp = [...hashFns].filter((val, i) => i !== index);
                            setHashFns(temp);
                            props.onChange(filterSize, temp.map( (code) => runCode(code) ));
                        }}>Delete</button>
                    </span>
                </div>
            </div>
        );
    }

    const addHashFn = () => {
        if (tryCode(txtCode)) {
            setHashFns([...hashFns, txtCode]); setTxtCode("// Write your hash function....");
            props.onChange(filterSize, [...hashFns, txtCode].map( (code) => runCode(code) ));    
        } else {
            alert("Please write a valid JavaScript pure function with a string argument.");
        }
    }

    const changeFilterSize = (val) => {
        console.log("Val Entered = ", val);
        setFilterSize(val);
        props.onChange(val, [...hashFns]);
    }
    

    return (
        <div>
            <div style={{ borderStyle: 'ridge', paddingTop: 5, paddingRight: 5, paddingLeft: 5, paddingBottom: 5}}>
                <h4>Filter Size</h4> 
                <input id="filSize" type="number" min={5} max={50} placeholder="Filter Size" onChange={(e) => changeFilterSize(Number(e.target.value))} value={filterSize} /><br /><br />
            </div>

            <div style={{ borderStyle: 'ridge', paddingTop: 5, paddingRight: 5, paddingLeft: 5, paddingBottom: 5 }}>
                <h4>Hash Functions</h4>

                <p>
                    <ul>
                    <li>Your hash functions should be a valid JavaScript functions with 1 string argument.</li>
                    <li>These functions also need to be Pure Functions which implies that<br/> they should give same output for a given input everytime irrespective of external state.</li>
                    </ul>
                    
                </p>
            
                <div style={{overflow: 'scroll', maxHeight: '200px'}}>
                    {hashFns.map((hashFn, i) => HashFn(hashFn, i))}
                </div>

                <div style={{ borderStyle: 'none', paddingTop: 5, paddingRight: 5, paddingLeft: 5, paddingBottom: 5 }}>
                    <textarea onChange={(e) => setTxtCode(e.target.value)} value={txtCode} rows={10} cols={76}></textarea><br/>
                    <button onClick={() => addHashFn()}>Add Hash Function</button>
                </div>
            </div>    
        </div>
    );
}