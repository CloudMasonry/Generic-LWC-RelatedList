import { LightningElement, api, wire } from 'lwc';
import fetchRelatedRecords from '@salesforce/apex/RelatedRecordsController.fetchRelatedRecords';
import saveRelatedRecords from '@salesforce/apex/RelatedRecordsController.saveRelatedRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


export default class InlineEditRelatedRecords extends LightningElement {
    @api recordId;
    @api childObjectApiName;
    @api relationshipField;
    @api fields;
    @api editableFields;

    relatedRecords = [];
    draftValues = [];
    wiredRecordsResult;

    @wire(fetchRelatedRecords, {
        parentId: '$recordId',
        childObjectApiName: '$childObjectApiName',
        relationshipField: '$relationshipField',
        fields: '$fields'
    })
    wiredRecords(response) {
        this.wiredRecordsResult = response; // Cache the response for refresh
        const { data, error } = response;
        if (data) {
            this.relatedRecords = data.map(record => ({
                ...record,
                Id: record.Id, 
                recordLink: `/lightning/r/${this.childObjectApiName}/${record.Id}/view` 
            }));
        } else if (error) {
            this.showToast('Error', 'Failed to fetch related records. Please contact your system administrator.', 'error', 'sticky');
        }
    }    
    refreshData() {
        refreshApex(this.wiredRecordsResult);
    }
    get datatableColumns() {
        let columns = [];
        if (this.fields) {
            const fieldNames = this.fields.split(',');
            const editableFieldSet = new Set(this.editableFields ? this.editableFields.split(',') : []);
    
            fieldNames.forEach((fieldName, index) => {
                fieldName = fieldName.trim();
                let formattedFieldName = fieldName.replace(/__c$/, ''); // Format field API name for label
                let label = formattedFieldName.replace(/_/g, ' '); // Replace underscores with spaces for label
                let isEditable = editableFieldSet.has(fieldName); // Determine if field is editable
    
                if (index === 0) { // Check if it's the first field
                    columns.push({
                        label: label,
                        fieldName: 'recordLink',
                        type: 'url',
                        typeAttributes: {
                            label: { fieldName: fieldName }, // Use the field value as the link label
                            target: '_blank', 
                        },
                        editable: false,
                    });
                } else {
                    columns.push({
                        label: label,
                        fieldName: fieldName,
                        editable: isEditable,
                    });
                }
            });
        }
        return columns;
    }
    handleSave(event) {
        const draftValues = event.detail.draftValues;

        if (draftValues.length > 0) {
            const editedRecords = this.prepareEditedRecords(draftValues);

            saveRelatedRecords({ editedRecords })
                .then(() => {
                    this.showToast('Success', 'Records updated', 'success');
                    this.draftValues = []; // Clear draft values
                    this.refreshData(); // Refresh the data to reflect the updated records
                })
                .catch(error => {
                    this.showToast('Error updating records', this.getErrorMessage(error), 'error');
                });
        } else {
            // No changes made, handle accordingly
        }
    }

    prepareEditedRecords(draftValues) {
        const recordMap = this.relatedRecords.reduce((map, record) => {
            map[record.Id] = record;
            return map;
        }, {});

        return draftValues.map(draft => {
            const originalRecord = recordMap[draft.Id];
            if (!originalRecord) return null;

            const updatedRecord = { ...originalRecord };
            Object.keys(draft).forEach(key => {
                if (key !== 'Id') updatedRecord[key] = draft[key];
            });

            return updatedRecord;
        }).filter(record => record !== null);
    }

    showToast(title, message, variant, mode = 'dismissable') {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant, mode }));
    }

    getErrorMessage(error) {
        // First, check if the error is a structured object with a body
        if (error && error.body) {
            // If the body contains an array of errors, join their messages
            if (Array.isArray(error.body)) {
                return error.body.map(e => e.message).join(', ');
            } 
            // If the body is an object with a 'message' field, return it directly
            else if (typeof error.body.message === 'string') {
                return error.body.message;
            }
        }
        // For network errors and other types where error.body is not set
        else if (error && typeof error.message === 'string') {
            return error.message;
        }
        return 'Unknown error';
    }
    
}
