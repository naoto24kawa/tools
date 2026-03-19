export type AriaCategory = 'landmark' | 'widget' | 'document' | 'abstract' | 'live-region';

export interface AriaEntry {
  name: string;
  type: 'role' | 'state' | 'property';
  category: AriaCategory;
  description: string;
  allowedValues?: string;
  relatedElements?: string;
  example?: string;
}

export const ARIA_DATA: AriaEntry[] = [
  // Landmark Roles
  {
    name: 'banner',
    type: 'role',
    category: 'landmark',
    description: 'A region that contains the site-oriented content, such as site name, logo, and navigation.',
    relatedElements: '<header>',
    example: '<header role="banner">...</header>',
  },
  {
    name: 'complementary',
    type: 'role',
    category: 'landmark',
    description: 'A supporting section of the document that is complementary to the main content.',
    relatedElements: '<aside>',
    example: '<aside role="complementary">...</aside>',
  },
  {
    name: 'contentinfo',
    type: 'role',
    category: 'landmark',
    description: 'A region that contains information about the parent document such as copyrights and links to privacy statements.',
    relatedElements: '<footer>',
    example: '<footer role="contentinfo">...</footer>',
  },
  {
    name: 'form',
    type: 'role',
    category: 'landmark',
    description: 'A region that contains a collection of items and objects that combine to create a form.',
    relatedElements: '<form>',
    example: '<form role="form" aria-label="Contact">...</form>',
  },
  {
    name: 'main',
    type: 'role',
    category: 'landmark',
    description: 'The main content of a document.',
    relatedElements: '<main>',
    example: '<main role="main">...</main>',
  },
  {
    name: 'navigation',
    type: 'role',
    category: 'landmark',
    description: 'A collection of navigational elements (usually links) for navigating the document or related documents.',
    relatedElements: '<nav>',
    example: '<nav role="navigation" aria-label="Main">...</nav>',
  },
  {
    name: 'region',
    type: 'role',
    category: 'landmark',
    description: 'A perceivable section containing content that is relevant to a specific purpose.',
    relatedElements: '<section>',
    example: '<section role="region" aria-label="Results">...</section>',
  },
  {
    name: 'search',
    type: 'role',
    category: 'landmark',
    description: 'A region that contains a collection of items and objects for searching.',
    relatedElements: '<search> (HTML5.2+)',
    example: '<form role="search">...</form>',
  },

  // Widget Roles
  {
    name: 'alert',
    type: 'role',
    category: 'widget',
    description: 'An element containing an important, usually time-sensitive, message.',
    example: '<div role="alert">Form submitted successfully!</div>',
  },
  {
    name: 'alertdialog',
    type: 'role',
    category: 'widget',
    description: 'A type of dialog that contains an alert message with initial focus going to an element within the dialog.',
    example: '<div role="alertdialog" aria-labelledby="title">...</div>',
  },
  {
    name: 'button',
    type: 'role',
    category: 'widget',
    description: 'An input that allows for user-triggered actions.',
    relatedElements: '<button>',
    example: '<div role="button" tabindex="0">Click me</div>',
  },
  {
    name: 'checkbox',
    type: 'role',
    category: 'widget',
    description: 'A checkable input that has three possible values: true, false, or mixed.',
    relatedElements: '<input type="checkbox">',
    allowedValues: 'aria-checked: true | false | mixed',
    example: '<div role="checkbox" aria-checked="false" tabindex="0">...</div>',
  },
  {
    name: 'combobox',
    type: 'role',
    category: 'widget',
    description: 'A composite widget combining a text input with a popup list of options.',
    allowedValues: 'aria-expanded: true | false',
    example: '<input role="combobox" aria-expanded="false" aria-controls="listbox1">',
  },
  {
    name: 'dialog',
    type: 'role',
    category: 'widget',
    description: 'A dialog is a descendant window of the primary window.',
    relatedElements: '<dialog>',
    example: '<div role="dialog" aria-labelledby="title" aria-modal="true">...</div>',
  },
  {
    name: 'gridcell',
    type: 'role',
    category: 'widget',
    description: 'A cell in a grid or treegrid.',
    relatedElements: '<td> within role="grid"',
    example: '<td role="gridcell">Cell content</td>',
  },
  {
    name: 'link',
    type: 'role',
    category: 'widget',
    description: 'An interactive reference to an internal or external resource.',
    relatedElements: '<a href="...">',
    example: '<span role="link" tabindex="0" onclick="...">Click here</span>',
  },
  {
    name: 'listbox',
    type: 'role',
    category: 'widget',
    description: 'A widget that allows the user to select one or more items from a list.',
    relatedElements: '<select>',
    example: '<ul role="listbox"><li role="option">Item 1</li></ul>',
  },
  {
    name: 'menu',
    type: 'role',
    category: 'widget',
    description: 'A type of widget that offers a list of choices to the user.',
    example: '<ul role="menu"><li role="menuitem">Save</li></ul>',
  },
  {
    name: 'menuitem',
    type: 'role',
    category: 'widget',
    description: 'An option in a set of choices contained by a menu or menubar.',
    example: '<li role="menuitem">Save</li>',
  },
  {
    name: 'option',
    type: 'role',
    category: 'widget',
    description: 'A selectable item in a select list.',
    relatedElements: '<option>',
    allowedValues: 'aria-selected: true | false',
    example: '<li role="option" aria-selected="false">Option 1</li>',
  },
  {
    name: 'progressbar',
    type: 'role',
    category: 'widget',
    description: 'An element that displays the progress status for tasks that take a long time.',
    relatedElements: '<progress>',
    allowedValues: 'aria-valuenow, aria-valuemin, aria-valuemax',
    example: '<div role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>',
  },
  {
    name: 'radio',
    type: 'role',
    category: 'widget',
    description: 'A checkable input in a group of radio roles, only one of which can be checked.',
    relatedElements: '<input type="radio">',
    allowedValues: 'aria-checked: true | false',
    example: '<div role="radio" aria-checked="true" tabindex="0">Option A</div>',
  },
  {
    name: 'slider',
    type: 'role',
    category: 'widget',
    description: 'An input where the user selects a value from within a given range.',
    relatedElements: '<input type="range">',
    allowedValues: 'aria-valuenow, aria-valuemin, aria-valuemax',
    example: '<div role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0">...</div>',
  },
  {
    name: 'switch',
    type: 'role',
    category: 'widget',
    description: 'A type of checkbox that represents on/off values.',
    allowedValues: 'aria-checked: true | false',
    example: '<button role="switch" aria-checked="false">Dark mode</button>',
  },
  {
    name: 'tab',
    type: 'role',
    category: 'widget',
    description: 'A grouping label providing a mechanism for selecting the tab content.',
    allowedValues: 'aria-selected: true | false',
    example: '<button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>',
  },
  {
    name: 'tabpanel',
    type: 'role',
    category: 'widget',
    description: 'A container for the resources associated with a tab.',
    example: '<div role="tabpanel" id="panel1" aria-labelledby="tab1">...</div>',
  },
  {
    name: 'textbox',
    type: 'role',
    category: 'widget',
    description: 'A type of input that allows free-form text as its value.',
    relatedElements: '<input type="text">, <textarea>',
    example: '<div role="textbox" contenteditable="true">...</div>',
  },
  {
    name: 'tooltip',
    type: 'role',
    category: 'widget',
    description: 'A contextual popup that displays a description for an element.',
    example: '<div role="tooltip" id="tip1">Helpful information</div>',
  },
  {
    name: 'tree',
    type: 'role',
    category: 'widget',
    description: 'A widget that allows the user to select one or more items from a hierarchically organized collection.',
    example: '<ul role="tree"><li role="treeitem">Item 1</li></ul>',
  },

  // Document Structure Roles
  {
    name: 'article',
    type: 'role',
    category: 'document',
    description: 'A section of a page that consists of a composition forming an independent part of a document.',
    relatedElements: '<article>',
    example: '<article role="article">...</article>',
  },
  {
    name: 'heading',
    type: 'role',
    category: 'document',
    description: 'A heading for a section of the page.',
    relatedElements: '<h1>-<h6>',
    allowedValues: 'aria-level: 1-6',
    example: '<div role="heading" aria-level="2">Section Title</div>',
  },
  {
    name: 'img',
    type: 'role',
    category: 'document',
    description: 'A container for an image.',
    relatedElements: '<img>',
    example: '<div role="img" aria-label="Photo of sunset">...</div>',
  },
  {
    name: 'list',
    type: 'role',
    category: 'document',
    description: 'A section containing listitem elements.',
    relatedElements: '<ul>, <ol>',
    example: '<div role="list"><div role="listitem">Item</div></div>',
  },
  {
    name: 'listitem',
    type: 'role',
    category: 'document',
    description: 'A single item in a list.',
    relatedElements: '<li>',
    example: '<div role="listitem">List item content</div>',
  },
  {
    name: 'separator',
    type: 'role',
    category: 'document',
    description: 'A divider that separates and distinguishes sections of content.',
    relatedElements: '<hr>',
    example: '<div role="separator"></div>',
  },
  {
    name: 'table',
    type: 'role',
    category: 'document',
    description: 'A section containing data arranged in rows and columns.',
    relatedElements: '<table>',
    example: '<div role="table" aria-label="Users">...</div>',
  },
  {
    name: 'toolbar',
    type: 'role',
    category: 'document',
    description: 'A collection of commonly used function buttons or controls.',
    example: '<div role="toolbar" aria-label="Formatting">...</div>',
  },

  // Live Region Roles
  {
    name: 'log',
    type: 'role',
    category: 'live-region',
    description: 'A type of live region where new information is added in meaningful order.',
    example: '<div role="log" aria-live="polite">...</div>',
  },
  {
    name: 'status',
    type: 'role',
    category: 'live-region',
    description: 'A type of live region whose content is advisory information for the user.',
    example: '<div role="status">3 results found</div>',
  },
  {
    name: 'timer',
    type: 'role',
    category: 'live-region',
    description: 'A type of live region containing a numerical counter indicating elapsed time.',
    example: '<div role="timer" aria-live="off">00:30</div>',
  },

  // States and Properties
  {
    name: 'aria-label',
    type: 'property',
    category: 'widget',
    description: 'Defines a string value that labels the current element.',
    allowedValues: 'string',
    example: '<button aria-label="Close">X</button>',
  },
  {
    name: 'aria-labelledby',
    type: 'property',
    category: 'widget',
    description: 'Identifies the element(s) that labels the current element.',
    allowedValues: 'ID reference(s)',
    example: '<div aria-labelledby="title1">...</div>',
  },
  {
    name: 'aria-describedby',
    type: 'property',
    category: 'widget',
    description: 'Identifies the element(s) that describes the current element.',
    allowedValues: 'ID reference(s)',
    example: '<input aria-describedby="help1" />\n<p id="help1">Enter your email</p>',
  },
  {
    name: 'aria-hidden',
    type: 'state',
    category: 'widget',
    description: 'Indicates whether the element is exposed to an accessibility API.',
    allowedValues: 'true | false',
    example: '<span aria-hidden="true">decorative icon</span>',
  },
  {
    name: 'aria-expanded',
    type: 'state',
    category: 'widget',
    description: 'Indicates whether the element, or another grouping element it controls, is expanded or collapsed.',
    allowedValues: 'true | false',
    example: '<button aria-expanded="false" aria-controls="panel">Toggle</button>',
  },
  {
    name: 'aria-required',
    type: 'property',
    category: 'widget',
    description: 'Indicates that user input is required on the element before a form may be submitted.',
    allowedValues: 'true | false',
    example: '<input aria-required="true" />',
  },
  {
    name: 'aria-invalid',
    type: 'state',
    category: 'widget',
    description: 'Indicates the entered value does not conform to the expected format.',
    allowedValues: 'true | false | grammar | spelling',
    example: '<input aria-invalid="true" aria-errormessage="err1" />',
  },
  {
    name: 'aria-live',
    type: 'property',
    category: 'live-region',
    description: 'Indicates that an element will be updated, and describes the types of updates.',
    allowedValues: 'off | polite | assertive',
    example: '<div aria-live="polite">Status updates here</div>',
  },
  {
    name: 'aria-atomic',
    type: 'property',
    category: 'live-region',
    description: 'Indicates whether assistive technologies will present all, or only parts of, the changed region.',
    allowedValues: 'true | false',
    example: '<div aria-live="polite" aria-atomic="true">...</div>',
  },
  {
    name: 'aria-busy',
    type: 'state',
    category: 'live-region',
    description: 'Indicates an element is being modified and assistive technologies may want to wait.',
    allowedValues: 'true | false',
    example: '<div aria-busy="true">Loading...</div>',
  },
  {
    name: 'aria-disabled',
    type: 'state',
    category: 'widget',
    description: 'Indicates that the element is perceivable but disabled.',
    allowedValues: 'true | false',
    example: '<button aria-disabled="true">Submit</button>',
  },
  {
    name: 'aria-modal',
    type: 'property',
    category: 'widget',
    description: 'Indicates whether an element is modal when displayed.',
    allowedValues: 'true | false',
    example: '<div role="dialog" aria-modal="true">...</div>',
  },
  {
    name: 'aria-current',
    type: 'state',
    category: 'widget',
    description: 'Indicates the element represents the current item within a container or set.',
    allowedValues: 'page | step | location | date | time | true | false',
    example: '<a aria-current="page" href="/">Home</a>',
  },
];

/**
 * Get unique categories from data.
 */
export function getCategories(): AriaCategory[] {
  return [...new Set(ARIA_DATA.map((e) => e.category))];
}

/**
 * Filter ARIA data by search query and category.
 */
export function filterAriaData(
  query: string,
  category?: AriaCategory,
  type?: AriaEntry['type'],
): AriaEntry[] {
  const lower = query.toLowerCase();
  return ARIA_DATA.filter((entry) => {
    if (category && entry.category !== category) return false;
    if (type && entry.type !== type) return false;
    if (!query) return true;
    return (
      entry.name.toLowerCase().includes(lower) ||
      entry.description.toLowerCase().includes(lower)
    );
  });
}
