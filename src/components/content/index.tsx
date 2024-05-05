/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import {useState} from 'preact/hooks';
import 'ojs/ojinputtext';
import 'ojs/ojcollapsible';

export function Content() {
  let [value, setValue] = useState('')
  function handleChange(e:any){
    const value = e.target.value as string;
    setValue(value.toUpperCase());
  }
  return (
    <div class="oj-web-applayout-max-width oj-web-applayout-content">
      <oj-collapsible>
        <h3 slot="header">Expand</h3>
        <oj-input-text value={value} onvalueChanged={handleChange}></oj-input-text>
      </oj-collapsible>
    </div>
  );
};
