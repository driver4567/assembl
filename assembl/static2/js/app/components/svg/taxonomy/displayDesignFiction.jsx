// @flow
import * as React from 'react';

type Props = {
  backgroundColor: ?string,
  color: ?string
};

const DisplayDesignFiction = ({ backgroundColor, color }: Props) => (
  <svg width="20px" height="20px" viewBox="0 0 20 20">
    <g id="icone-Activer-fiction-design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="activer-Fiction-design-Copy-2">
        <circle id="Oval-6" fill={backgroundColor} cx="10" cy="10" r="10" />
        <g id="pen-tip" transform="translate(6.000000, 2.000000)" fill={color} fillRule="nonzero">
          <path
            d="M12.8274485,5.33596392 C12.6526856,5.12045876 12.3363969,5.08715464 12.1205567,5.26198454 L9.90801031,7.05531443 L9.60586082,6.75316495 C9.6057268,6.75303093 9.60565979,6.75289691 9.60565979,6.75289691 L6.1867268,3.33396392 L6.1867268,3.33389691 L5.88424227,3.03147938 L7.67757216,0.819 C7.85233505,0.603360825 7.81923196,0.286871134 7.60359278,0.112108247 C7.38795361,-0.0625206186 7.07146392,-0.0294845361 6.89670103,0.186087629 L4.81830928,2.75037113 C4.65627835,2.95026289 4.67142268,3.24021649 4.85328866,3.42221649 L5.00995876,3.5788866 L1.48454639,5.58731959 C1.35695876,5.66002577 1.2675,5.785 1.23982474,5.9292732 L0.00904639175,12.3422268 C-0.0223814433,12.505866 0.0294175258,12.6745309 0.147221649,12.7924021 C0.242376289,12.8874897 0.370634021,12.9395567 0.50264433,12.9395567 C0.534139175,12.9395567 0.565835052,12.9366082 0.597329897,12.9305103 L7.01041753,11.699799 C7.15469072,11.6721237 7.27973196,11.5826649 7.35243814,11.4550103 L9.36080412,7.92959794 L9.51747423,8.08633505 C9.61510825,8.18390206 9.74383505,8.23348969 9.87303093,8.23348969 C9.9846701,8.23348969 10.0967113,8.19643299 10.1893866,8.12131443 L12.7536701,6.04285567 C12.9691082,5.86809278 13.0022113,5.55160309 12.8274485,5.33596392 Z M6.59354639,10.7562938 L2.01995876,11.6340619 L5.08152577,8.58247938 C5.24831443,8.65424742 5.42930928,8.69264433 5.61633505,8.69264433 C5.97812371,8.69264433 6.31840206,8.55165464 6.57424742,8.29587629 C7.10222165,7.76783505 7.10222165,6.90856186 6.57418041,6.38011856 C6.31833505,6.1242732 5.9780567,5.98335052 5.61626804,5.98335052 C5.25447938,5.98335052 4.91426804,6.1242732 4.65842268,6.38005155 C4.40257732,6.63596392 4.26165464,6.97617526 4.26165464,7.33803093 C4.26165464,7.52452062 4.29971649,7.70504639 4.37114948,7.87143299 L1.30375258,10.9287113 L2.1833299,6.34601031 L5.74700515,4.31586598 L8.62375773,7.19255155 L6.59354639,10.7562938 Z M5.36920103,7.58503093 C5.30319588,7.51902577 5.26687629,7.43130928 5.26687629,7.33789691 C5.26687629,7.24455155 5.30326289,7.15683505 5.36926804,7.09076289 C5.43520619,7.02475773 5.52292268,6.98843814 5.61633505,6.98843814 C5.70968041,6.98843814 5.79746392,7.02482474 5.86340206,7.09069588 C5.99963402,7.22706186 5.99976804,7.44879897 5.86353608,7.58496392 C5.79759794,7.65096907 5.70981443,7.68735567 5.61640206,7.68735567 C5.5230567,7.68742268 5.43520619,7.65103608 5.36920103,7.58503093 Z" // eslint-disable-line
            id="Shape"
          />
        </g>
      </g>
    </g>
  </svg>
);

DisplayDesignFiction.defaultProps = {
  color: '#5404d7',
  backgroundColor: '#f2f1fa'
};

export default DisplayDesignFiction;