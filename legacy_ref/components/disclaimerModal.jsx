import React from "react";

const disclaimerModal = () => {
  return (
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                class="h-6 w-6 text-green-600"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Disclaimer</h3>
              <div class="mt-2">
                <p class="text-sm leading-5 text-gray-500">
                  {" "}
                  I. General information about the risk Aquari sp. z o.o. is the issuer of AQUARI tokens that have characteristics close to virtual currencies under the Directive (EU) 2018/843 of the European Parliament and of the Council of 30 May 2018 amending Directive (EU) 2015/849 on the prevention of the use of the financial system for the purposes of money laundering or terrorist financing, and amending Directives (Official Journal of the European Union, L 156/43). It means that the
                  AQUARI token is a digital representation of value that is not issued or guaranteed by a central bank or a public authority, is not necessarily attached to a legally established currency and does not possess a legal status of currency or money, but is accepted by natural or legal persons as a means of exchange and which can be transferred, stored and traded electronically. Aquari sp.z o.o. cannot guarantee the value of the AQUARI token or the possibility of its practical use, in
                  particular to pay for goods or services with it. The potential use of AQUARI tokens is based on assumptions about the future, which is associated with the risk of unforeseen events and, as a consequence, there is the possibility of loss of value of AQUARI tokens or the inability to use them. Aquari sp.z o.o. declares that: 1) AQUARI tokens may lose their value in part or in full;  2) AQUARI tokens may not always be transferable; 3) AQUARI tokens may not be liquid; 4) AQUARI
                  tokens may not be exchangeable against the good or service promised in this White Paper, especially in case of failure or discontinuation of the project. II. The detailed description of the risk factors Each investment carries the risk of losing all or part of the invested funds. Taking each investment decision must be preceded by assesing the impact of risk on the result of the investment. The most significant aspects of the risk related to investing in AQUARI tokens are
                  listed below. 1. Exchange rate volatility risk (market risk) - there is a risk that the AQUARI token price will change to the investor's disadvantage. Tokens are particularly volatile. Single transactions can significantly affect their value. The exchange rate of tokens may be influenced by macroeconomic indicators characteristic of most instruments, i.e., interest rates, unemployment rate, economic growth, inflation level, political situation. The exchange rate of tokens is
                  also significantly influenced by events closely related to the virtual currencies market, e.g., hacking attacks weakening the trust in entities providing services related to trading in virtual currencies. 2. Regulatory risk - a change in the law, as well as the adoption of an official position by competent supervisory authorities on the legal qualification of virtual currencies, may directly or indirectly affect the economic situation of investors, and thus the value of the
                  AQUARI token. 3. Technological risk - according to the current state of science, it is nearly impossible to break the blockchain register, however, entities providing services related to trading virtual currencies are exposed to hacking attacks, which may result in the loss of all or part of AQUARI tokens. Repeated cyber-attacks may also lead to loss trust in all technology and, consequently, the complete loss of value of virtual currencies 4. Liquidity risk - there is a risk
                  that the AQUARI token cannot be sold without adversely affecting its price. There may also be a situation where the sale of AQUARI tokens will not be possible at all. 5. Risk of lack of guarantee - investing in AQUARI tokens is structurally different from a bank deposit and is not covered by any benefit guarantee system. In particular, an investment in AQUARI tokens is associated with the risk of losing all or part of the invested funds. 6. Operational risk – Aquari sp. z o.o.
                  undertakes to adhere to the highest professional standards, to keep due diligence and to do its utmost to achieve the goals specified in this White Paper. However, Aquari sp. z o.o. cannot guarantee achieving these goals. Therefore there is a risk of possibility of using inappropriate or defective systems, including human errors, technical failures and external events that may affect Aquari sp. z o.o. operations, and thus cause failure or discontinuation of the project. The
                  types of risks associated with investing in AQUARI tokens described in this document may exist alone, however, in some cases they may also accumulate due to the correlations between them. The investor should be aware of the possibility of a situation in which, as a result of a cause-and-effect sequence, several types of risk will materialize. Aquari sp. z o.o. recommends that, before purchasing AQUARI tokens, the investor should get acquainted with the specificity of virtual
                  currencies and assess whether the investment is appropriate for him, taking into account the risk level tolerated by him, the expected rate of return and his knowledge and investment experience. Aquari sp. z o.o. do not encourage nor suggest investing in AQUARI tokens. Any acquisition or disposal of AQURI tokens is a result of a conscious investor’s decision. Investment in AQUARI tokens is not covered by the deposit guarantee schemes established in accordance with
                  Directive 2014/49/EU of the European Parliament and of the Council nor is covered by the investor compensation schemes established in accordance with Directive 97/9/EC of the European Parliament and of the Council.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                Accept
              </button>
            </span>
            <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                Cancel
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default disclaimerModal;
