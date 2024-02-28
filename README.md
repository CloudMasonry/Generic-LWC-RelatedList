# Generic-LWC-RelatedList

This Lightning Web Component (LWC) is designed to display related records in a datatable format with inline editing capabilities. It allows users to view, edit, and save changes to records directly from the datatable. The first field in the datatable is presented as a clickable link that navigates to the record's detail page.

-Features-
Display Related Records: Fetches and displays related records based on the parent record ID.
Inline Editing: Users can edit certain fields directly within the datatable.
Clickable Links: The first field in each row is rendered as a clickable link, providing quick access to the record's detail page.
Dynamic Columns: The component dynamically generates datatable columns based on specified field names.
Error Handling: Displays error messages through toast notifications for various error states, such as failed data fetch or save operations.

-Attributes-

recordId: (String) The ID of the parent record. This attribute is typically set automatically when used on a record page.
childObjectApiName: (String) API name of the child object whose related records are to be displayed.
relationshipField: (String) API name of the relationship field on the child object that points back to the parent record.
fields: (String) Comma-separated list of field API names to be displayed in the datatable.
editableFields: (String) Comma-separated list of field API names that should be editable within the datatable.
Apex Controllers
RelatedRecordsController: Apex controller class that contains methods to fetch and save related records.
fetchRelatedRecords: Method to fetch related records based on the provided parameters.
saveRelatedRecords: Method to save the edited records back to the database.

-Usage-
To use this component, add it to a Lightning Record Page, App Page, or Home Page through the Lightning App Builder. Ensure you set all the required attributes (recordId, childObjectApiName, relationshipField, fields, editableFields) for the component to function correctly.

Example of adding this component to a Lightning Record Page:

Navigate to the Lightning App Builder.
Select the desired Lightning Record Page or create a new one.
Drag the "Inline Edit Related Records" component onto the page layout.
Configure the component attributes in the right-hand panel.
Save and activate the page.
