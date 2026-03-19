export type AriaCategory =
  | 'landmark'
  | 'widget'
  | 'document-structure'
  | 'live-region'
  | 'window';

export interface AriaEntry {
  name: string;
  type: 'role' | 'property' | 'state';
  category: AriaCategory;
  description: string;
  allowedValues?: string;
  htmlEquivalent?: string;
}

export const ariaDatabase: AriaEntry[] = [
  // Landmark roles
  { name: 'banner', type: 'role', category: 'landmark', description: 'Site-oriented content at the beginning of a page. Typically contains logo, site title, navigation.', htmlEquivalent: '<header>' },
  { name: 'complementary', type: 'role', category: 'landmark', description: 'Supporting content related to the main content. Meaningful when separated.', htmlEquivalent: '<aside>' },
  { name: 'contentinfo', type: 'role', category: 'landmark', description: 'Information about the parent document: copyright, links to privacy statements.', htmlEquivalent: '<footer>' },
  { name: 'form', type: 'role', category: 'landmark', description: 'A region containing a collection of form-associated elements.', htmlEquivalent: '<form>' },
  { name: 'main', type: 'role', category: 'landmark', description: 'The main content of the document.', htmlEquivalent: '<main>' },
  { name: 'navigation', type: 'role', category: 'landmark', description: 'A collection of navigational elements (links) for navigating the document or related documents.', htmlEquivalent: '<nav>' },
  { name: 'region', type: 'role', category: 'landmark', description: 'A perceivable section containing content relevant to a specific purpose.', htmlEquivalent: '<section>' },
  { name: 'search', type: 'role', category: 'landmark', description: 'A landmark region for search functionality.', htmlEquivalent: '<search>' },

  // Widget roles
  { name: 'alert', type: 'role', category: 'widget', description: 'A type of live region with important, usually time-sensitive, information.' },
  { name: 'button', type: 'role', category: 'widget', description: 'An input that allows for user-triggered actions.', htmlEquivalent: '<button>' },
  { name: 'checkbox', type: 'role', category: 'widget', description: 'A checkable input with three possible values: true, false, or mixed.', htmlEquivalent: '<input type="checkbox">' },
  { name: 'combobox', type: 'role', category: 'widget', description: 'A composite widget combining an input and a popup (listbox or grid).' },
  { name: 'dialog', type: 'role', category: 'widget', description: 'A dialog is a descendant window of the primary window.', htmlEquivalent: '<dialog>' },
  { name: 'link', type: 'role', category: 'widget', description: 'An interactive reference to a resource.', htmlEquivalent: '<a href>' },
  { name: 'listbox', type: 'role', category: 'widget', description: 'A widget presenting a list of options for selection.' },
  { name: 'menu', type: 'role', category: 'widget', description: 'A type of widget offering a list of choices to the user.' },
  { name: 'menubar', type: 'role', category: 'widget', description: 'A horizontal menu bar, usually containing menuitem elements.' },
  { name: 'menuitem', type: 'role', category: 'widget', description: 'An option in a menu or menubar.' },
  { name: 'option', type: 'role', category: 'widget', description: 'A selectable item in a listbox.', htmlEquivalent: '<option>' },
  { name: 'progressbar', type: 'role', category: 'widget', description: 'Displays the progress status for tasks taking a long time.', htmlEquivalent: '<progress>' },
  { name: 'radio', type: 'role', category: 'widget', description: 'A checkable input in a group of radio roles.', htmlEquivalent: '<input type="radio">' },
  { name: 'radiogroup', type: 'role', category: 'widget', description: 'A group of radio buttons.' },
  { name: 'slider', type: 'role', category: 'widget', description: 'An input where the user selects a value from within a given range.', htmlEquivalent: '<input type="range">' },
  { name: 'spinbutton', type: 'role', category: 'widget', description: 'An input for selecting from a range by incrementing/decrementing.', htmlEquivalent: '<input type="number">' },
  { name: 'switch', type: 'role', category: 'widget', description: 'A type of checkbox that represents on/off values.' },
  { name: 'tab', type: 'role', category: 'widget', description: 'A grouping label for a tabpanel.' },
  { name: 'tablist', type: 'role', category: 'widget', description: 'A list of tab elements.' },
  { name: 'tabpanel', type: 'role', category: 'widget', description: 'A container for the resource associated with a tab.' },
  { name: 'textbox', type: 'role', category: 'widget', description: 'An input for free-form text.', htmlEquivalent: '<input type="text"> or <textarea>' },
  { name: 'tooltip', type: 'role', category: 'widget', description: 'A contextual popup that displays a description for an element.' },
  { name: 'tree', type: 'role', category: 'widget', description: 'A widget presenting a hierarchical list.' },
  { name: 'treeitem', type: 'role', category: 'widget', description: 'An option item of a tree.' },

  // Document structure roles
  { name: 'article', type: 'role', category: 'document-structure', description: 'A self-contained composition (blog post, comment, etc.).', htmlEquivalent: '<article>' },
  { name: 'cell', type: 'role', category: 'document-structure', description: 'A cell in a tabular container.', htmlEquivalent: '<td>' },
  { name: 'columnheader', type: 'role', category: 'document-structure', description: 'A header cell in a column.', htmlEquivalent: '<th scope="col">' },
  { name: 'definition', type: 'role', category: 'document-structure', description: 'A definition of a term.', htmlEquivalent: '<dd>' },
  { name: 'figure', type: 'role', category: 'document-structure', description: 'Self-contained content with optional caption.', htmlEquivalent: '<figure>' },
  { name: 'group', type: 'role', category: 'document-structure', description: 'A set of user interface objects not intended to be in page summary.', htmlEquivalent: '<fieldset>' },
  { name: 'heading', type: 'role', category: 'document-structure', description: 'A heading for a section of the page.', htmlEquivalent: '<h1>-<h6>' },
  { name: 'img', type: 'role', category: 'document-structure', description: 'A container for an image.', htmlEquivalent: '<img>' },
  { name: 'list', type: 'role', category: 'document-structure', description: 'A list of items.', htmlEquivalent: '<ul> or <ol>' },
  { name: 'listitem', type: 'role', category: 'document-structure', description: 'A single item in a list.', htmlEquivalent: '<li>' },
  { name: 'row', type: 'role', category: 'document-structure', description: 'A row of cells in a table.', htmlEquivalent: '<tr>' },
  { name: 'rowgroup', type: 'role', category: 'document-structure', description: 'A group of rows.', htmlEquivalent: '<thead>/<tbody>/<tfoot>' },
  { name: 'separator', type: 'role', category: 'document-structure', description: 'A divider separating sections of content.', htmlEquivalent: '<hr>' },
  { name: 'table', type: 'role', category: 'document-structure', description: 'A structure containing rows and columns of data.', htmlEquivalent: '<table>' },
  { name: 'term', type: 'role', category: 'document-structure', description: 'A word or phrase with an optional definition.', htmlEquivalent: '<dt>' },
  { name: 'toolbar', type: 'role', category: 'document-structure', description: 'A collection of commonly used function buttons or controls.' },

  // Live region roles
  { name: 'log', type: 'role', category: 'live-region', description: 'A type of live region where new information is added in meaningful order.' },
  { name: 'marquee', type: 'role', category: 'live-region', description: 'A type of live region with non-essential information that changes frequently.' },
  { name: 'status', type: 'role', category: 'live-region', description: 'A live region for advisory information that is not important enough for alert.', htmlEquivalent: '<output>' },
  { name: 'timer', type: 'role', category: 'live-region', description: 'A numerical counter indicating elapsed time or remaining time.' },

  // Window roles
  { name: 'alertdialog', type: 'role', category: 'window', description: 'A dialog containing an alert message where initial focus goes to an element within the dialog.' },

  // ARIA Properties
  { name: 'aria-label', type: 'property', category: 'widget', description: 'Defines a string value that labels the current element.', allowedValues: 'string' },
  { name: 'aria-labelledby', type: 'property', category: 'widget', description: 'Identifies the element(s) that label the current element.', allowedValues: 'ID reference list' },
  { name: 'aria-describedby', type: 'property', category: 'widget', description: 'Identifies the element(s) that describe the current element.', allowedValues: 'ID reference list' },
  { name: 'aria-required', type: 'property', category: 'widget', description: 'Indicates that user input is required on the element.', allowedValues: 'true | false' },
  { name: 'aria-placeholder', type: 'property', category: 'widget', description: 'Defines a short hint intended to aid the user with data entry.', allowedValues: 'string' },
  { name: 'aria-valuemin', type: 'property', category: 'widget', description: 'Defines the minimum allowed value for a range widget.', allowedValues: 'number' },
  { name: 'aria-valuemax', type: 'property', category: 'widget', description: 'Defines the maximum allowed value for a range widget.', allowedValues: 'number' },
  { name: 'aria-valuenow', type: 'property', category: 'widget', description: 'Defines the current value for a range widget.', allowedValues: 'number' },
  { name: 'aria-valuetext', type: 'property', category: 'widget', description: 'Defines the human-readable text alternative of aria-valuenow.', allowedValues: 'string' },
  { name: 'aria-orientation', type: 'property', category: 'widget', description: 'Indicates whether the element orientation is horizontal, vertical, or unknown.', allowedValues: 'horizontal | vertical | undefined' },
  { name: 'aria-autocomplete', type: 'property', category: 'widget', description: 'Indicates whether inputting text could trigger display of predictions.', allowedValues: 'inline | list | both | none' },
  { name: 'aria-haspopup', type: 'property', category: 'widget', description: 'Indicates the availability of an interactive popup element.', allowedValues: 'false | true | menu | listbox | tree | grid | dialog' },
  { name: 'aria-level', type: 'property', category: 'document-structure', description: 'Defines the hierarchical level of an element within a structure.', allowedValues: 'integer >= 1' },
  { name: 'aria-multiselectable', type: 'property', category: 'widget', description: 'Indicates that the user may select more than one item.', allowedValues: 'true | false' },
  { name: 'aria-readonly', type: 'property', category: 'widget', description: 'Indicates that the element is not editable.', allowedValues: 'true | false' },
  { name: 'aria-sort', type: 'property', category: 'widget', description: 'Indicates sort direction for table or grid column headers.', allowedValues: 'ascending | descending | none | other' },
  { name: 'aria-live', type: 'property', category: 'live-region', description: 'Indicates that an element will be updated, and describes the types of updates.', allowedValues: 'off | polite | assertive' },
  { name: 'aria-atomic', type: 'property', category: 'live-region', description: 'Indicates whether AT will present all or only parts of changed region.', allowedValues: 'true | false' },
  { name: 'aria-relevant', type: 'property', category: 'live-region', description: 'Indicates what notifications the user agent will trigger when the accessibility tree is modified.', allowedValues: 'additions | additions text | all | removals | text' },

  // ARIA States
  { name: 'aria-checked', type: 'state', category: 'widget', description: 'Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.', allowedValues: 'true | false | mixed | undefined' },
  { name: 'aria-disabled', type: 'state', category: 'widget', description: 'Indicates that the element is perceivable but disabled.', allowedValues: 'true | false' },
  { name: 'aria-expanded', type: 'state', category: 'widget', description: 'Indicates whether a grouping element is expanded or collapsed.', allowedValues: 'true | false | undefined' },
  { name: 'aria-hidden', type: 'state', category: 'widget', description: 'Indicates whether the element is exposed to an accessibility API.', allowedValues: 'true | false | undefined' },
  { name: 'aria-invalid', type: 'state', category: 'widget', description: 'Indicates the entered value does not conform to the expected format.', allowedValues: 'true | false | grammar | spelling' },
  { name: 'aria-pressed', type: 'state', category: 'widget', description: 'Indicates the current "pressed" state of toggle buttons.', allowedValues: 'true | false | mixed | undefined' },
  { name: 'aria-selected', type: 'state', category: 'widget', description: 'Indicates the current "selected" state of various widgets.', allowedValues: 'true | false | undefined' },
  { name: 'aria-busy', type: 'state', category: 'live-region', description: 'Indicates an element is being modified and AT may wait before exposing to user.', allowedValues: 'true | false' },
  { name: 'aria-current', type: 'state', category: 'widget', description: 'Indicates the element representing the current item within a container.', allowedValues: 'page | step | location | date | time | true | false' },
];

export function searchAriaEntries(
  query: string,
  categoryFilter?: AriaCategory,
  typeFilter?: AriaEntry['type'],
): AriaEntry[] {
  const lower = query.toLowerCase();
  return ariaDatabase.filter((entry) => {
    if (categoryFilter && entry.category !== categoryFilter) return false;
    if (typeFilter && entry.type !== typeFilter) return false;
    if (!query) return true;
    return (
      entry.name.toLowerCase().includes(lower) ||
      entry.description.toLowerCase().includes(lower)
    );
  });
}

export function getCategories(): AriaCategory[] {
  return ['landmark', 'widget', 'document-structure', 'live-region', 'window'];
}

export function getCategoryLabel(cat: AriaCategory): string {
  const labels: Record<AriaCategory, string> = {
    landmark: 'Landmark',
    widget: 'Widget',
    'document-structure': 'Document Structure',
    'live-region': 'Live Region',
    window: 'Window',
  };
  return labels[cat];
}
