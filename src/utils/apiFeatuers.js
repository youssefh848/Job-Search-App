export class ApiFeature {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
    }

    // Pagination 
    pagination() {
        let { page, size } = this.queryData;
        page = page && page > 0 ? parseInt(page) : 1;
        size = size && size > 0 ? parseInt(size) : 3;

        const skip = (page - 1) * size;
        this.mongooseQuery.skip(skip).limit(size);
        return this;
    }

    // Sorting 
    sort() {
        let { sort } = this.queryData;
        if (sort) {
            sort = sort.replaceAll(',', ' ');
            this.mongooseQuery.sort(sort);
        }
        return this;
    }

    // Field selection 
    select() {
        let { select } = this.queryData;
        if (select) {
            select = select.replaceAll(',', ' ');
            this.mongooseQuery.select(select);
        }
        return this;
    }

    // Filtering 
    filter() {
        let { page, size, sort, select, ...filters } = this.queryData;

        const filterConditions = {};
        // List of allowed filters
        const allowedFilters = ['workingTime', 'jobLocation', 'seniorityLevel', 'jobTitle', 'technicalSkills'];
        
        allowedFilters.forEach(key => {
            if (filters[key]) {
                if (key === 'jobTitle') {
                    filterConditions.jobTitle = { $regex: filters.jobTitle, $options: 'i' };
                } else if (key === 'technicalSkills') {
                    filterConditions.technicalSkills = { $in: filters.technicalSkills.split(',') };
                } else {
                    // Add other filters F
                    filterConditions[key] = filters[key];
                }
            }
        });

        // Apply the filter conditions to the query
        this.mongooseQuery.find(filterConditions);
        return this;
    }

}
