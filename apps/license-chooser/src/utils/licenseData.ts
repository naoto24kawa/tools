export interface LicenseFeatures {
  commercial: boolean;
  modify: boolean;
  distribute: boolean;
  patent: boolean;
  sublicense: boolean;
  private: boolean;
  disclose: boolean;
  sameLicense: boolean;
}

export interface License {
  id: string;
  name: string;
  shortDescription: string;
  features: LicenseFeatures;
  text: string;
}

export const LICENSES: License[] = [
  {
    id: 'MIT',
    name: 'MIT License',
    shortDescription: 'A short and simple permissive license. Very popular for open source.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: false,
      sublicense: true,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    id: 'Apache-2.0',
    name: 'Apache License 2.0',
    shortDescription: 'Permissive license with patent grant. Good for enterprise use.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: true,
      sublicense: true,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and
distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the
copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other
entities that control, are controlled by, or are under common control with
that entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising
permissions granted by this License.

"Source" form shall mean the preferred form for making modifications.

"Object" form shall mean any form resulting from mechanical transformation
or translation of a Source form.

"Work" shall mean the work of authorship made available under the License.

"Derivative Works" shall mean any work that is based on the Work.

"Contribution" shall mean any work of authorship submitted to the Licensor
for inclusion in the Work.

"Contributor" shall mean Licensor and any Legal Entity on behalf of whom a
Contribution has been received by the Licensor.

2. Grant of Copyright License.

Subject to the terms and conditions of this License, each Contributor hereby
grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free,
irrevocable copyright license to reproduce, prepare Derivative Works of,
publicly display, publicly perform, sublicense, and distribute the Work and
such Derivative Works in Source or Object form.

3. Grant of Patent License.

Subject to the terms and conditions of this License, each Contributor hereby
grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free,
irrevocable patent license to make, have made, use, offer to sell, sell,
import, and otherwise transfer the Work.

4. Redistribution.

You may reproduce and distribute copies of the Work or Derivative Works
thereof in any medium, with or without modifications, and in Source or Object
form, provided that You meet the following conditions:

(a) You must give any other recipients of the Work or Derivative Works a copy
of this License; and

(b) You must cause any modified files to carry prominent notices stating that
You changed the files; and

(c) You must retain, in the Source form of any Derivative Works that You
distribute, all copyright, patent, trademark, and attribution notices; and

(d) If the Work includes a "NOTICE" text file, You must include a readable
copy of the attribution notices contained within such NOTICE file.

5. Submission of Contributions.

Any Contribution intentionally submitted for inclusion in the Work by You to
the Licensor shall be under the terms and conditions of this License.

6. Trademarks.

This License does not grant permission to use the trade names, trademarks,
service marks, or product names of the Licensor.

7. Disclaimer of Warranty.

THE WORK IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
OF ANY KIND.

8. Limitation of Liability.

IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE FOR ANY DAMAGES ARISING OUT OF
THE USE OF THE WORK.

9. Accepting Warranty or Additional Liability.

You may choose to offer, and charge a fee for, acceptance of support,
warranty, indemnity, or other liability obligations.

END OF TERMS AND CONDITIONS

Copyright [yyyy] [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`,
  },
  {
    id: 'GPL-3.0',
    name: 'GNU General Public License v3.0',
    shortDescription: 'Strong copyleft license. Derivative works must also be open source.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: true,
      sublicense: false,
      private: true,
      disclose: true,
      sameLicense: true,
    },
    text: `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>

Everyone is permitted to copy and distribute verbatim copies of this license
document, but changing it is not allowed.

PREAMBLE

The GNU General Public License is a free, copyleft license for software and
other kinds of works. The licenses for most software and other practical works
are designed to take away your freedom to share and change the works. By
contrast, the GNU General Public License is intended to guarantee your freedom
to share and change all versions of a program--to make sure it remains free
software for all its users.

[Full GPL-3.0 text continues... See https://www.gnu.org/licenses/gpl-3.0.txt]

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.`,
  },
  {
    id: 'BSD-2-Clause',
    name: 'BSD 2-Clause "Simplified" License',
    shortDescription: 'Simple permissive license with only two clauses.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: false,
      sublicense: false,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `BSD 2-Clause License

Copyright (c) [year], [fullname]

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
  },
  {
    id: 'BSD-3-Clause',
    name: 'BSD 3-Clause "New" or "Revised" License',
    shortDescription: 'Permissive license with a clause against endorsement.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: false,
      sublicense: false,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `BSD 3-Clause License

Copyright (c) [year], [fullname]

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
  },
  {
    id: 'ISC',
    name: 'ISC License',
    shortDescription: 'Simple and permissive. Functionally equivalent to MIT.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: false,
      sublicense: true,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `ISC License

Copyright (c) [year] [fullname]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`,
  },
  {
    id: 'MPL-2.0',
    name: 'Mozilla Public License 2.0',
    shortDescription: 'Weak copyleft. Changes to MPL-licensed files must be shared.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: true,
      sublicense: false,
      private: true,
      disclose: true,
      sameLicense: true,
    },
    text: `Mozilla Public License Version 2.0

1. Definitions

1.1. "Contributor" means each individual or legal entity that creates, contributes
to the creation of, or owns Covered Software.

1.2. "Contributor Version" means the combination of the Contributions of others
(if any) used by a Contributor and that particular Contributor's Contribution.

1.3. "Contribution" means Covered Software of a particular Contributor.

1.4. "Covered Software" means Source Code Form to which the initial Contributor
has attached the notice in Exhibit A, the Executable Form of such Source Code
Form, and Modifications of such Source Code Form.

1.5. "Incompatible With Secondary Licenses" means that the initial Contributor
has attached the notice described in Exhibit B to the Covered Software.

[Full MPL-2.0 text continues... See https://www.mozilla.org/en-US/MPL/2.0/]

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can
obtain one at https://mozilla.org/MPL/2.0/.`,
  },
  {
    id: 'LGPL-3.0',
    name: 'GNU Lesser General Public License v3.0',
    shortDescription: 'Copyleft for the library itself, but allows proprietary linking.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: true,
      sublicense: false,
      private: true,
      disclose: true,
      sameLicense: true,
    },
    text: `GNU LESSER GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>

Everyone is permitted to copy and distribute verbatim copies of this license
document, but changing it is not allowed.

This version of the GNU Lesser General Public License incorporates the terms
and conditions of version 3 of the GNU General Public License, supplemented
by the additional permissions listed below.

[Full LGPL-3.0 text continues... See https://www.gnu.org/licenses/lgpl-3.0.txt]

This library is free software; you can redistribute it and/or modify it under
the terms of the GNU Lesser General Public License as published by the Free
Software Foundation; either version 3 of the License, or (at your option) any
later version.

This library is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
details.

You should have received a copy of the GNU Lesser General Public License along
with this library. If not, see <https://www.gnu.org/licenses/>.`,
  },
  {
    id: 'Unlicense',
    name: 'The Unlicense',
    shortDescription: 'Dedicates work to the public domain. No conditions.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: false,
      sublicense: true,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`,
  },
  {
    id: 'CC0-1.0',
    name: 'Creative Commons Zero v1.0 Universal',
    shortDescription: 'Public domain dedication. Waives all rights.',
    features: {
      commercial: true,
      modify: true,
      distribute: true,
      patent: false,
      sublicense: true,
      private: true,
      disclose: false,
      sameLicense: false,
    },
    text: `Creative Commons Legal Code

CC0 1.0 Universal

CREATIVE COMMONS CORPORATION IS NOT A LAW FIRM AND DOES NOT PROVIDE
LEGAL SERVICES. DISTRIBUTION OF THIS DOCUMENT DOES NOT CREATE AN
ATTORNEY-CLIENT RELATIONSHIP. CREATIVE COMMONS PROVIDES THIS
INFORMATION ON AN "AS-IS" BASIS. CREATIVE COMMONS MAKES NO WARRANTIES
REGARDING THE USE OF THIS DOCUMENT OR THE INFORMATION OR WORKS
PROVIDED HEREUNDER, AND DISCLAIMS LIABILITY FOR DAMAGES RESULTING FROM
THE USE OF THIS DOCUMENT OR THE INFORMATION OR WORKS PROVIDED
HEREUNDER.

Statement of Purpose

The laws of most jurisdictions throughout the world automatically confer
exclusive Copyright and Related Rights upon the creator and subsequent
owner(s) of an original work of authorship and/or a database.

The person associating CC0 with a Work (the "Affirmer"), to the extent
that he or she is an owner of Copyright and Related Rights in the Work,
voluntarily elects to apply CC0 to the Work and publicly distribute the
Work under its terms, with knowledge of his or her Copyright and Related
Rights in the Work and the meaning and intended legal effect of CC0 on
those rights.

1. Copyright and Related Rights.

A Work made available under CC0 may be protected by copyright and related
or neighboring rights.

2. Waiver.

To the greatest extent permitted by applicable law, the Affirmer hereby
overtly, fully, permanently, irrevocably and unconditionally waives,
abandons, and surrenders all of the Affirmer's Copyright and Related
Rights.

3. Public License Fallback.

Should any part of the Waiver be judged legally invalid or ineffective,
the Waiver shall be preserved to the maximum extent permitted. In addition,
the Affirmer grants a license to exercise the Rights stated above.

4. Limitations and Disclaimers.

No trademark or patent rights held by the Affirmer are waived.

For more information, please see
<https://creativecommons.org/publicdomain/zero/1.0/>`,
  },
];

export const FEATURE_LABELS: Record<keyof LicenseFeatures, string> = {
  commercial: 'Commercial use',
  modify: 'Modification',
  distribute: 'Distribution',
  patent: 'Patent grant',
  sublicense: 'Sublicense',
  private: 'Private use',
  disclose: 'Source disclosure required',
  sameLicense: 'Same license required',
};

export interface QuestionAnswer {
  needsCommercial: boolean | null;
  needsPatent: boolean | null;
  needsCopyleft: boolean | null;
}

export function recommendLicenses(answers: QuestionAnswer): License[] {
  return LICENSES.filter((license) => {
    if (answers.needsCommercial === true && !license.features.commercial) return false;
    if (answers.needsPatent === true && !license.features.patent) return false;
    if (answers.needsCopyleft === true && !license.features.sameLicense) return false;
    if (answers.needsCopyleft === false && license.features.sameLicense) return false;
    return true;
  });
}

export function getLicenseById(id: string): License | undefined {
  return LICENSES.find((l) => l.id === id);
}
