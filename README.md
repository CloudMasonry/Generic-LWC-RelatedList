# Generic-LWC-RelatedList

This Lightning Web Component (LWC) is designed to display related records in a datatable format with inline editing capabilities. It allows users to view, edit, and save changes to records directly from the datatable. The first field in the datatable is presented as a clickable link that navigates to the record's detail page.

-Attributes-

recordId: (String) The ID of the parent record. This attribute is typically set automatically when used on a record page.

childObjectApiName: (String) API name of the child object whose related records are to be displayed.

relationshipField: (String) API name of the relationship field on the child object that points back to the parent record.

fields: (String) Comma-separated list of field API names to be displayed in the datatable.

editableFields: (String) Comma-separated list of field API names that should be editable within the datatable.

-Usage-
To use this component, add it to a Lightning Record Page, App Page, or Home Page through the Lightning App Builder. Ensure you set all the required attributes (recordId, childObjectApiName, relationshipField, fields, editableFields) for the component to function correctly.

Example of adding this component to a Lightning Record Page:

Navigate to the Lightning App Builder.
Select the desired Lightning Record Page or create a new one.
Drag the component onto the page layout.
Configure the component attributes in the right-hand panel.
Save and activate the page.
